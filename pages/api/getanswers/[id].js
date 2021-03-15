import { GraphQLClient, gql } from "graphql-request";
import { getSession } from "next-auth/client";

//
// whole thing moved to lib
//

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export default async (req, res) => {
  const { id } = req.query;
  //console.log("server" + id);
  const session = await getSession({ req });
  if (!session) {
    res.status(403).json({ message: "Failed" });
    return;
  }

  const { email } = session.user; // authenticated user
  const graphcms = new GraphQLClient(process.env.GRAPHCMS_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.GRAPHCMS_MUTATION_TOKEN}`,
    },
  });

  const { questionsConnection } = await graphcms.request(
    `query Answers($orgId: ID!, $objectId: String!) {
      questionsConnection {
        edges {
          node {
            questiontext
            answers(where: {organization: {id: $orgId}, person: {objectId_not: $objectId}}) {
              answer
              person {
                name
                profilePic
                objectId
              }
            }
          }
        }
      }
    }
    `,
    { objectId: email, orgId: id }
  );

  const {
    organization: { persons },
  } = await graphcms.request(
    `
      query NotMe($orgId: ID!, $objectId: String!) {
        organization(where: { id: $orgId }) {
          persons(where: { objectId_not: $objectId }) {
            id
            name
            profilePic
            objectId
          }
        }
      }
    `,
    { objectId: email, orgId: id }
  );

  const dataReduced = questionsConnection.edges.reduce(
    (accumulator, currentValue) => {
      const {
        node: { questiontext, answers },
      } = currentValue;
      const answersReduced = answers.reduce(
        (answerAccumulator, currentAnswer) => {
          currentAnswer.person.correct = true;
          const other = persons.filter(
            (f) => f.objectId !== currentAnswer.person.objectId
          );
          if (other.length > 0) {
            currentAnswer.person2 = other[getRandomInt(other.length)];
            answerAccumulator.push(currentAnswer);
          }
          return answerAccumulator;
        },
        []
      );
      answersReduced.length > 1 &&
        accumulator.push({ question: questiontext, answer: answersReduced });
      return accumulator;
    },
    []
  );
  console.log(dataReduced);
  res.status(200).json(dataReduced);
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
    { id: { id: id } }
  );
  //console.log(id);
  res.status(200).json(questionsAnsweredTotal.aggregate);
};

export { getQuestionAnsweredTotal };
