import { GraphQLClient } from "graphql-request";

export default async (req, res) => {
  const graphcms = new GraphQLClient(
    "https://api-eu-central-1.graphcms.com/v2/ckkti66v1ntb701z6e1vedxe0/master",
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
