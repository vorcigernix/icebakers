import { GraphQLClient, gql } from "graphql-request";
import { getSession } from "next-auth/client";

export async function getQuestions(context) {
  const session = await getSession(context);
  const { id } = context.params;
  const { email } = session.user;

  const graphcms = new GraphQLClient(process.env.GRAPHCMS_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.GRAPHCMS_MUTATION_TOKEN}`,
    },
  });

  const { publicquestions, companyquestions } = await graphcms.request(
    `
      query getQuestions($orgId: ID!) {
        publicquestions: questions(where: { organization: null }) {
          questiontext
          id
        }
        companyquestions: questions(where: { organization: { id: $orgId } }) {
          questiontext
          id
        }
      }
    `,
    { orgId: id }
  );

  const { answers } = await graphcms.request(
    `
    query OtherAnswers($orgId: ID!, $objectId: String!) {
        answers(where: {organization: {id: $orgId }, person: {objectId_not: $objectId}}) {
          id
        }
      }
    `,
    { objectId: email, orgId: id }
  );

  const eligible = answers.length > 15;
  const data = Object.assign(publicquestions, companyquestions);
  //console.log(data);
  return { data, eligible };
}
