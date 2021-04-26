/**
 * Claim tips - tell the system that we have claimed all the tips, remove the tip
 * Call this if there are pending tips
 */

import { getSession } from 'next-auth/client'
import { connectToDatabase } from "../../util/mongodb";
import claimTips from "../../lib/claimTips";

// This is called to claim any pending tips
const handler = async (req, res) => {

    const session = await getSession({ req })
    if (!session) {
        res.status(403);
        return;
    }
    // retrieving the users' email from the session
    const { email, address } = session.user; // authenticated user

    // find the user and add the private key to their account (insert into array)
    // we will claim all the tips after 

    const { db } = await connectToDatabase();

    const result = await db
        // .collection("users")
        .collection("tips")
        .findOne(
            {
                email: email
            }
        );
    
    await claimTips(address, result, db);
    // const contractDefinition = await getContractInstance(Web3, Contract);
    // const result = await contractDefinition.methods.hasTips(Web3.utils.soliditySha3(email)).call();

    res.status(200).json({ "success": "Tips claimed" });
}

export default handler;
