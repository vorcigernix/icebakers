import { GraphQLClient } from "graphql-request";

/**
 * When a user joins this function will be called. It will use the emailId to 
 * update the users' details inside the CMS
 */
export default async (emailId) => {
    const graphcms = new GraphQLClient(
        process.env.GRAPHCMS_ENDPOINT,
        {
            headers: {
                authorization: `Bearer ${process.env.GRAPHCMS_MUTATION_TOKEN}`,
            },
        }
    );

    console.log(`User ${emailId} - this is a test`);
    /**
     * This query will create a user 
     * It should happen after the registration event
     * The objectId is the email address
     * We need to add a name and profilepic
     */
    const { createPerson } = await graphcms.request(
        `mutation createPerson ($id:String!){
            createPerson(data: {objectId: $id}) {
              id
              objectId
            }
          }`,
        { id: emailId }
    );

    await graphcms.request(
        `mutation publishPerson($id: ID!) {
          publishPerson(where: {id:$id}, to: PUBLISHED) {
            id
          }
        }`,
        { id: createPerson.id }
      );

    console.log(`User ${emailId} has been registered. Person is ${createPerson.objectId}`);
};

/*
`
mutation createPerson ($id:String!){
    createPerson(data: {objectId: $id}) {
      objectId
      organizations {
        id
        name
      }
      answers {
        question {
          questiontext
        }
        answer
      }
    }
  }


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

  mutation joinOrganisation($id: String! $orgId: ID) {
    updatePerson(where: {objectId: $id},
      data: {
        organizations: {
          connect:{
            where:{
              id:$orgId
            }
          }
        }
      }
    ) {
      id
    	organizations: id
    }
  }


  ckktipic8a0nw0a456w4gmt13

  `
*/