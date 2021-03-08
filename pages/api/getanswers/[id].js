import { GraphQLClient, gql } from "graphql-request";
import { getSession } from "next-auth/client";

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export default async (req, res) => {
  const { id } = req.query;
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
      answersReduced.length > 1 && accumulator.push({question: questiontext, answer:answersReduced})
      return accumulator;
    },
    []
  );

  //console.log(dataReduced)

/*   // step 1 - for all questions returned, randomly choose an answer that is not empty
  const data = questionsConnection.edges
    .map((e) => e.node)
    .filter((e) => e.answers.length > 0)
    .filter(
      (e) =>
        (e.answers = e.answers.filter(
          (e) =>
            e.answer &&
            e.answer !== "" &&
            e.answer.trim() !== "" &&
            e.answer.length > 1
        )) && e.answers.length > 1 //like one answer is kinda not enough, this was probably the issue
    );

  // choose an answer
  data.forEach((e) => {
    //console.log(Object.values(e.answers));
    // remove all answers that i have answered because i don't need to guess my own answers
    e.answers = e.answers.filter((a) => a.person.objectId !== email);
    if (e.answers.length === 0) return; // no point because there are no answers (after filtering my own)
    const ans = getRandomInt(e.answers.length);
    e.answer = e.answers[ans];
    const other = persons.filter(
      (f) => f.objectId !== email && f.objectId !== e.answer.person.objectId
    );
    if (other.length === 0) {
      // hmmmmm
      return;
    }
    e.answer.person2 = other[getRandomInt(other.length)];
    e.answer.person.correct = true;

    if (getRandomInt(100) > 50) {
      const correct = e.answer.person;
      e.answer.person = e.answer.person2;
      e.answer.person2 = correct;
    }
  });
  // step 2 - randomly choose two "people" who have answered that (not including current user)
  // step 3 - return for each question, a single random answer and two optional people */

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
