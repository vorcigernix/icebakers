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

  const {
    personsConnection: {
      aggregate: { count },
    },
  } = await graphcms.request(
    `
    query OtherAnswers($orgId: ID!, $objectId: String!) {
        personsConnection(where: {objectId_not: $objectId, organization: {id: $orgId}, answers_every: {answer_not: ""}}) {
          aggregate {
            count
          }
        }
      }
    `,
    { objectId: email, orgId: id }
  );
  const eligible = count >= 2;
  const data = Object.assign(publicquestions, companyquestions);
  return { data, eligible };
}
