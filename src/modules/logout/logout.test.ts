import { createTypeormConn } from "../../utils/createTypeormConn";
import { User } from "../../entity/User";
import { Connection } from "typeorm";
import { TestClient } from "../../utils/testClient";

let userId: string;
let conn: Connection;
const email = "bob5@bob.com";
const password = "jlkajoioiqwe";

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
describe.skip("Logout", () => {
  test("multiple sessions", async () => {
    const session1 = new TestClient(process.env.TEST_HOST as string);
    const session2 = new TestClient(process.env.TEST_HOST as string);

    session1.login(email, password);
    session2.login(email, password);
    expect(await session1.me()).toEqual(await session2.me());

    session1.logout();
    expect(await session1.me()).toEqual(await session2.me());
  });

  // need to debug, cookies aren't being saved
  test("It should log out user", async () => {
    // signin user
    const client = new TestClient(process.env.TEST_HOST as string);

    await client.login(email, password);

    // get user ingo
    const response = await client.me();

    // verify user info
    expect(response.data.data).toEqual({
      me: {
        id: userId,
        email
      }
    });

    // logout user
    await client.logout();

    // get user info, should be null
    const response2 = await client.me();

    expect(response2.data.me).toBeNull();
  });
});
