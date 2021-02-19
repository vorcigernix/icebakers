import { GraphQLClient } from "graphql-request";

export default async ({ body }, res) => {
  const graphcms = new GraphQLClient(process.env.GRAPHCMS_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.GRAPHCMS_MUTATION_TOKEN}`,
    },
  });

  const { answersQuery } = await graphcms.request(
    `query answersQueryCount($id: ID!) {
        answersConnection(where: {organization: {id: $id}}) {
          aggregate{count}
        }
    }`,
    { id: body.id }
  );
  const { answers } = await graphcms.request(answersQuery);

  res.status(200).json(answers);
};
