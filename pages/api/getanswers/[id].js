import { GraphQLClient } from "graphql-request";

export default async (req, res) => {
  const { id } = req.query;
  const graphcms = new GraphQLClient(process.env.GRAPHCMS_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.GRAPHCMS_MUTATION_TOKEN}`,
    },
  });

  const { getAnswersQuery } = await graphcms.request(
    `query getAnswersQuery($orgId: ID!) {
        answersConnection(where: {organization: {id: $orgId}}) {
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
    { orgId: id }
  );
  console.log(id)
  const { answers } = await graphcms.request(getAnswersQuery);
  res.status(200).json(answers);
};

/**
 * Given a question id, return the number of people who answered that selected question
 */
const getQuestionAnsweredTotal = async (req, res) => {
  const { id } = req.query;
  const graphcms = new GraphQLClient(process.env.GRAPHCMS_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.GRAPHCMS_MUTATION_TOKEN}`,
    },
  });

  const { questionsAnsweredTotal } = await graphcms.request(
    `query questionsAnsweredTotal($id: QuestionWhereInput) {
      answersConnection(where: {question: $id}) {
        aggregate {
          count
        }
      }
    }`,
    { id: {id: id} }
  );
  console.log(id)
  res.status(200).json(questionsAnsweredTotal.aggregate);
}

export { getQuestionAnsweredTotal };

/*
query questionsAnsweredTotal($id: QuestionWhereInput) {
  answersConnection(where: {question: $id}) {
    aggregate {
      count
    }
  }
}

*/