import { GraphQLClient } from 'graphql-request';
import { getSession } from 'next-auth/client';

/**
 * This function allows a user to join the company
 * - email: this is provided in the session
 * - orgId : this is provided by caller in the json object
 * req.body.orgId
 */
export default async (req, res) => {
  const session = await getSession({ req })
  if (!session) {
    res.status(403);
    return;
  }

  const { email } = session.user; // authenticated user
  const graphcms = new GraphQLClient(
    process.env.GRAPHCMS_ENDPOINT,
    {
      headers: {
        authorization: `Bearer ${process.env.GRAPHCMS_MUTATION_TOKEN}`,
      },
    }
  );
  const body = req.body;
  console.log(body);
  const { updatePerson } = await graphcms.request(
    ` mutation connectOrgPeople($id: String! $orgId: ID) {
        updatePerson(where: {objectId: $id}, 
          data: {
            organizations: {
              connect:{
                where:{
                  id:$orgId
                }
              }
            }       
          }
        ) {
          id
          organizations: id
        }
      }`,
    { id: email, orgId: body.orgId }
  );

  res.status(200).json({ id: updatePerson.id, answers: updatePerson.answers });
};
