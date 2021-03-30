import { GraphQLClient } from "graphql-request";

export default async (req, res) => {
  const graphcms = new GraphQLClient(process.env.GRAPHCMS_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.GRAPHCMS_MUTATION_TOKEN}`,
    },
  });
  //const { id } = req.params;

  console.log(req.query);

  const { answersQuery } = await graphcms.request(
    `query answersQueryCount($id: ID!) {
      persons(where: {organization: {id: $id}}) {
        answers {
          id
        }       
        id
      }
    }`,
    { id: req.id }
  );
  const { answers } = await graphcms.request(answersQuery);
  console.log(answers);

  res.status(200).json(answers);
};
