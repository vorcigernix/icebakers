import { GraphQLClient } from "graphql-request";

export default async ({ body }, res) => {
  const graphcms = new GraphQLClient(process.env.GRAPHCMS_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.GRAPHCMS_MUTATION_TOKEN}`,
    },
  });

  console.log(body);

  const { createCompany } = await graphcms.request(
    `
    mutation insertCompany($name) {
      createOrganization(data: {name: $name}) {
        id
      }
    }`,
    { name: body.name }
  );

  await graphcms.request(
    `mutation publishCompany($id: ID!) {
      publishOrganization(where: { id: $id }, to: PUBLISHED) {
        id
      }
    }`,
    { id: createCompany.id }
  );

  res.status(200).json({ id: createCompany.id });
};
