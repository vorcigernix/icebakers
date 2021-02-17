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

  const questionsQuery = `{
    questions {
        questiontext
      }
    }`;

  const { questions } = await graphcms.request(questionsQuery);
  //console.log(data)

  res.status(200).json(questions);
};
