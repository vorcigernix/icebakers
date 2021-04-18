import { GraphQLClient, gql } from "graphql-request";
import { getSession } from "next-auth/client";

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function selectRandom(array, count) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function getAnswers(context) {
  const session = await getSession(context);
  if (!session) return null;
  const { id } = context.params;
  const { email } = session.user;

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
        accumulator.push({
          question: questiontext,
          answer: selectRandom(answersReduced, 5),
        });
      return accumulator;
    },
    []
  );
  return dataReduced;
}
