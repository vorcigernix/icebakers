/**
 * Claim tips - tell the system that we have claimed all the tips, remove the tip
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
  
    // find the user and add the private key to their account (insert into array)
    // we will claim all the tips after 

    const { db } = await connectToDatabase();

    const result = await db
        // .collection("users")
        .collection("tips")
        .findOneAndUpdate(
            {
                email: email
            },
            {
                $set: {tipped: []}
            }
        );
    
    
    // const contractDefinition = await getContractInstance(Web3, Contract);
    // const result = await contractDefinition.methods.hasTips(Web3.utils.soliditySha3(email)).call();

    res.status(200).json({ "success": "Tips claimed" });
}

export default handler;