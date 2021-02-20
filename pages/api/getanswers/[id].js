import { GraphQLClient } from "graphql-request";

export default async (req, res) => {
  const { id } = req.query;
  const graphcms = new GraphQLClient(process.env.GRAPHCMS_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.GRAPHCMS_MUTATION_TOKEN}`,
    },
  });

  // todo: this should come from questions, with filter on the organisation. e.g.:
  /*

  query MyQuery ($id:ID) {
  questionsConnection(where: {organization: {id:$id}}) {
    edges {
      node {
        questiontext
        answers {
          answer
          person {
            name
            profilePic
          }
        }
        
      }
    }
  }
}

// and supply the org id that you want to look at

*/
  const { answersConnection } = await graphcms.request(
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
  console.log(id, answersConnection)
  res.status(200).json(answersConnection.edges);
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