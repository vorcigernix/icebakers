/**
 * ConnectWallet is called to link the wallet address of a user to their email address
 * IF the email address link has associated tips, the user will be paid-out the tips and
 * notified of their pending tips
 */

import { resolveWeb3 } from "../../lib/getWeb3Server";
import getContractInstance from "../../lib/getContract";
import Contract from "../../lib/contracts/TipEscrow.json";
import { getSession } from 'next-auth/client';
import { connectToDatabase } from '../../util/mongodb';


const handler = async (req, res) => {
    const session = await getSession({ req })
    if (!session) {
        res.status(403);
        return;
    }

    const { email, address } = session.user; // authenticated user

    if ((req.method !== "POST") || !email) {
        res.status(403).json({"result":"failure", "message":"Invalid response"});
        return;
    }

    console.log(`Authenticated user has ${email}, address ${address}`)

    if (address) {
        res.status(200).json({"result":"success", "message": `Already registered, ${address} to ${email}`});
        return;
    }

    const updatedAddress = JSON.parse(req.body).address;

    console.log(`Authenticated user has ${email}, we are updating them ${updatedAddress}`)

    const Web3 = await resolveWeb3();
    const accounts = await Web3.eth.getAccounts();
    const contractDefinition = await getContractInstance(Web3, Contract);

    const { db } = await connectToDatabase();
    const results = await db
    .collection("userUsers")
    .findOneAndUpdate(
        {
            email
        },
        {
            $set: {
                erctwenty: updatedAddress,
                updatedAt: new Date()
            }
        }
    );

    console.log(results);

    console.log(`Connected User Wallet ${updatedAddress} to client email ${email}`);

    const result = +(await contractDefinition.methods.hasTips(Web3.utils.soliditySha3(email)).call());
    if (result) {
        // claim the tips!
        const result = await contractDefinition.methods.claim(updatedAddress, Web3.utils.soliditySha3(email)).send({from:accounts[0]});
        res.status(200).json({"result": "Successfully claimed tips as well!"});
        return;
    }
    res.status(200).json({"result":"success", "message": `Registered ${updatedAddress} to ${email}`});
}

export default handler;