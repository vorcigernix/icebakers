import { GraphQLClient } from "graphql-request";
import { getSession } from "next-auth/client";

export default async (req, res) => {
  const { body } = req;
  const session = await getSession({ req });
  if (!session) {
    res.status(403);
    return;
  }

  const { email } = session.user; // authenticated user

  const graphcms = new GraphQLClient(process.env.GRAPHCMS_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.GRAPHCMS_MUTATION_TOKEN}`,
    },
  });

  //console.log(body);

  const { createOrganization } = await graphcms.request(
    `
    mutation insertCompany($name:String) {
      createOrganization(data: {name: $name}) {
        id
      }
    }`,
    { name: body.name }
  );

  //console.log(createOrganization);

  await graphcms.request(
    `mutation publishCompany($id: ID!) {
      publishOrganization(where: { id: $id }, to: PUBLISHED) {
        id
      }
    }`,
    { id: createOrganization.id }
  );

  const { updatePerson } = await graphcms.request(
    ` mutation connectOrgPeople($id: String! $orgId: ID) {
      updatePerson(where: {objectId: $id}, 
        data: {
          organization: {
            connect:{
                id:$orgId
            }
          }       
        }
      ) {
        id
        organization: id
      }
    }`,
    { id: email, orgId: createOrganization.id }
  );
  console.log(createOrganization.id);
  res.status(200).json({ id: createOrganization.id });
};
