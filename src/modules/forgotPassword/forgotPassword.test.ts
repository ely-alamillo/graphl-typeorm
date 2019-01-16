import { createTypeormConn } from "../../utils/createTypeormConn";
import { User } from "../../entity/User";
import { Connection } from "typeorm";
import { TestClient } from "../../utils/testClient";
import { createForgotPasswordLink } from "../../utils/createForgotPasswordLink";
import * as redis from "ioredis";

let userId: string;
let conn: Connection;
const redisClient = new redis();
const email = "bob5@bob.com";
const password = "jlkajoioiqwe";
const newPassword = "adsjflk";

beforeAll(async () => {
  conn = await createTypeormConn();
  const user = await User.create({
    email,
    password,
    confirmed: true
  }).save();
  userId = user.id;
});

afterAll(async () => {
  conn.close();
});

// need to find way to persist cookie rightn now it's not working
describe("forgot password", async () => {
  test("It works", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);

    const url = await createForgotPasswordLink("", userId, redisClient);
    const parts = url.split("/");
    const key = parts[parts.length - 1];

    const res = await client.forgotPasswordChange(newPassword, key);

    expect(res.data).toEqual({
      forgotPasswordChange: null
    });

    expect(await client.login(email, newPassword)).toEqual({
      data: {
        login: null
      }
    });
  });
});
