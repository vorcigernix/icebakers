import { GraphQLClient } from "graphql-request";

export default async ({ body }, res) => {
  const graphcms = new GraphQLClient(process.env.GRAPHCMS_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.GRAPHCMS_MUTATION_TOKEN}`,
    },
  });

  const { answersQuery } = await graphcms.request(
    `query getAnswersQuery {
        answersConnection(where: {organization: {id: "ckktohxfcb3bi0f48u19qmlnj"}}) {
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
    { id: body.id }
  );
  const { answers } = await graphcms.request(answersQuery);

  res.status(200).json(answers);
};
