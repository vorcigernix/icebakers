import { GraphQLClient } from "graphql-request";

export default async (req, res) => {
  const graphcms = new GraphQLClient(
    process.env.GRAPHCMS_ENDPOINT,
    {
      headers: {
        authorization: `Bearer ${process.env.GRAPHCMS_MUTATION_TOKEN}`,
      },
    }
  );

  const companiesQuery = `{
        organizations {
            id
            name
          }
        }`;

  const {organizations} = await graphcms.request(companiesQuery);
  //console.log(data)

  res.status(200).json(organizations);
};
