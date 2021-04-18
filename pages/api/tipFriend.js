/**
 * TipFriend - the private keys are shared with your friend, who can then redeem the tip from 
 * escrow by signing their public key with the private key and sharing the curve values with
 * the escrow "withdraw" function
 */

import { getSession } from 'next-auth/client'
import { connectToDatabase } from "../../util/mongodb";

// Call this to get any pending tips. It should be done when a user logs in
// This will encourage the user to redeem the tips by linking their public key
const handler = async (req, res) => {
    const session = await getSession({ req })
    if (!session) {
        res.status(403);
        return;
    }
    // retrieving the users' email from the session
    const { email } = session.user;
    const body = JSON.parse(req.body);
    const friendEmail = body.friendEmail;
    const accessId = body.accessId;

    console.log("Email is", friendEmail, accessId, body);
    
    if (!accessId) {
        res.status()
    }
    // find the user and add the private key to their account (insert into array)
    // we will claim all the tips after 

    const { db } = await connectToDatabase();
    const result = await db
        // .collection("users")
        .collection("tips")
        .update(
            {
                email: friendEmail
            },
            {
                $push: { tipped: accessId }
            },
            {
                upsert: true
            }
        );
    // const contractDefinition = await getContractInstance(Web3, Contract);
    // const result = await contractDefinition.methods.hasTips(Web3.utils.soliditySha3(email)).call();

    res.status(200).json({ "success": "updated tips" });
}

export default handler;