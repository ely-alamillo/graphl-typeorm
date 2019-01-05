import { request } from "graphql-request";
import { Users } from "../entity/User";
import { startServer } from "../startServer";

const email = "tet@test.com";
const password = "password";

let getHost = () => "";

const mutation = `
mutation {
    register(email: "${email}", password: "${password}")
}
`;

beforeAll(async () => {
  const app = await startServer();
  const { port } = app.address() as any;
  getHost = () => `http://127.0.0.1:${port}`;
});

test("It registers user successfully.", async () => {
  const response = await request(getHost(), mutation);
  expect(response).toEqual({ register: true });

  const users = await Users.find({ where: { email } });
  expect(users).toHaveLength(1);

  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(email);
});
