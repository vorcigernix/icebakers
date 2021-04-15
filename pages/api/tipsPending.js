/**
 * ConnectWallet is called to link the wallet address of a user to their email address
 * IF the email address link has associated tips, the user will be paid-out the tips and
 * notified of their pending tips
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

    // get the user based on their email
    // check their tipsPending field in the database

    // // find the wallet
    // const Web3 = await resolveWeb3();
    // tipped

    const { db } = await connectToDatabase();
    const result = await db
    // .collection("users")
    .collection("users")
    .findOne(
        {
            email
        }
    );

    // const contractDefinition = await getContractInstance(Web3, Contract);
    // const result = await contractDefinition.methods.hasTips(Web3.utils.soliditySha3(email)).call();

    res.status(200).json({ "pending": result.tipped?.length > 0 ? result.tipped?.length : 0 });
}

export default handler;