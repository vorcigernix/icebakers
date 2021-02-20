import { GraphQLClient } from "graphql-request";
import { getSession } from "next-auth/client";

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export default async (req, res) => {
  const { id } = req.query;
  const session = await getSession({ req })
  if (!session) {
    res.status(403);
    return;
  }

  const { email } = session.user; // authenticated user
  const graphcms = new GraphQLClient(process.env.GRAPHCMS_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.GRAPHCMS_MUTATION_TOKEN}`,
    },
  });

  // todo: this should come from questions, with filter on the organisation. e.g.:
  /*

  query MyQuery  {
  questionsConnection {
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
  const { questionsConnection } = await graphcms.request(
    `query MyQuery  {
      questionsConnection {
        edges {
          node {
            questiontext
            answers {
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
    }`,
    { orgId: id }
  );

  const { persons } = await graphcms.request(
    `query MyQuery {
      persons {
        name
        objectId
        profilePic
        organizations {
          id
          name
        }
      }
    }    
    `)
  
  // step 1 - for all questions returned, randomly choose an answer that is not empty
  const data = questionsConnection.edges.map(e => e.node)
    .filter(e => e.answers.length > 0)
    .filter(e => e.answers.filter(e=> e.answer && e.answer !== "" && e.answer.trim() !== "").length > 0);

  // choose an answer
  data.forEach(e => {
    // remove all answers that i have answered because i don't need to guess my own answers
    e.answers = e.answers.filter(a=>a.person.objectId !== email);
    if (e.answers.length === 0) return; // no point because there are no answers ...
    const ans = getRandomInt(e.answers.length);
    e.answer = e.answers[ans];   
    const other = persons.filter(f=> f.objectId !== email && f.objectId !== e.answer.person.objectId);
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
  // step 3 - return for each question, a single random answer and two optional people

  res.status(200).json(data);
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