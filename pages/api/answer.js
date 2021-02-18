import { GraphQLClient } from 'graphql-request';
import { getSession } from 'next-auth/client';

/**
 * This function will allow you to answer a selected question
 * req:
 * - email: is derived from the session
 * - ans: this is the answer to the question provided
 * - qnId: this is the question id selected
 * - orgId: this is the organisation that the question is associated with
 * 
 * req.body = {
 *   ans,
 *   qnId,
 *   orgId
 * }
 */
export default async (req, res) => {
  const session = await getSession({ req })
  if (!session) {
    res.status(403);
    return;
  }

  const { email } = session.user; // authenticated user
  const graphcms = new GraphQLClient(
    process.env.GRAPHCMS_ENDPOINT,
    {
      headers: {
        authorization: `Bearer ${process.env.GRAPHCMS_MUTATION_TOKEN}`,
      },
    }
  );
  const body = JSON.parse(req.body);
  console.log(body);
  const { updatePerson } = await graphcms.request(
    `mutation answerQuestion($id: String! $ans: String $qnId: ID $orgId: ID) {
      updatePerson(where: {objectId: $id}, 
        data: {
          answers: {
            create: {
              answer: $ans
              organization: {
                connect:{
                  id:$orgId
                }
              }
              question: {
                connect:{
                  id: $qnId
                }
              }
            }
          }
        }
      ) {
        id
        answers: id
      }
    }`,
    { id: email, ans: body.ans, qnId: body.qnId, orgId: body.orgId }
  );

  await graphcms.request(
    `mutation publishAnswer($id: ID!) {
      publishAnswer(where: {id:$id}) {
        id
      }
    }`,
    { id: updatePerson.answers }
  );

  res.status(200).json({ id: updatePerson.id, answers: updatePerson.answers });
};


/*
mutation answerQuestion($id: String! $ans: String $qnId: ID $orgId: ID) {
    updatePerson(where: {objectId: $id},
      data: {
        answers: {
          create: {
            answer: $ans
            organization: {
              connect:{
                id:$orgId
              }
            }
            question: {
              connect:{
                id: $qnId
              }
            }
          }
        }
      }
    ) {
      id
    }
  }
*/