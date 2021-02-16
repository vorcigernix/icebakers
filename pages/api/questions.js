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

  const questionsQuery = `{
    questions {
        questiontext
      }
    }`;

  const { questions } = await graphcms.request(questionsQuery);
  //console.log(data)

  res.status(200).json(questions);
};
