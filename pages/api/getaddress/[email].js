import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  const { email } = req.query;
  const session = await getSession({ req })
  if (!session) {
    res.status(403).send("permission denied");
    return;
  }

  const { db } = await connectToDatabase();
  const results = await db
    .collection("users")
    .findOne(
      {
        email
      }
    );

  if (!results) {
    res.status(200).json({ email: email });
    return;
  }
  res.status(200).json({ address: results.erctwenty, email: results.email });
};
