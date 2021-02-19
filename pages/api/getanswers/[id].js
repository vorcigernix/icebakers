import { GraphQLClient } from "graphql-request";

export default async (req, res) => {
  const { id } = req.query;
  const graphcms = new GraphQLClient(process.env.GRAPHCMS_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.GRAPHCMS_MUTATION_TOKEN}`,
    },
  });

  const { answersQuery } = await graphcms.request(
    `query getAnswersQuery($id: ID!) {
        answersConnection(where: {organization: {id: $id}}) {
          edges {
            node {
              answer
              person {
                name    
                profilePic
              }
            }
          }
        }
      }`,
    { id: id }
  );
  const { answers } = await graphcms.request(answersQuery);
  res.status(200).json(answers);
};
