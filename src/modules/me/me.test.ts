import axios from "axios";
import { Connection } from "typeorm";
import { createTypeormConnection } from "../../utils/createTypeormConnection";
import { Users } from "../../entity/User";

let conn: Connection;
const email = "john@testttt.com";
const password = "password";
let userId: string;

const loginMutation = (userEmail: string, userPass: string) => {
  return `
mutation {
    login(email: "${userEmail}", password: "${userPass}") {
      path
      message
    }
}
`;
};

const meQuery = `
    me {
        id
        email
    }
`;

beforeAll(async () => {
  conn = await createTypeormConnection();
  const user = await Users.create({
    email,
    password,
    confirmed: true
  }).save();
  userId = user.id;
});

afterAll(async () => {
  conn.close();
});

describe("Me Query", () => {
  //   test("Can't get user if not logged in", async () => {});
  console.log({ testhos: process.env.TEST_HOST });
  test("Get current user", async () => {
    await axios.post(
      process.env.TEST_HOST as string,
      {
        query: loginMutation(email, password)
      },
      {
        withCredentials: true
      }
    );

    const res2 = await axios.post(
      process.env.TEST_HOST as string,
      {
        query: meQuery
      },
      {
        withCredentials: true
      }
    );

    expect(res2.data.data.me.email).toEqual({
      me: {
        id: userId,
        email
      }
    });
  });
});
