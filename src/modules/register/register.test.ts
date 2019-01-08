import { request } from "graphql-request";
import { Users } from "../../entity/User";
import { startServer } from "../../startServer";

const email = "tet@test.com";
const password = "password";

let getHost = () => "";

const mutation = `
mutation {
    register(email: "${email}", password: "${password}") {
      path
      message
    }
}
`;

beforeAll(async () => {
  const app = await startServer();
  const { port } = app.address() as any;
  getHost = () => `http://127.0.0.1:${port}`;
});

test("It registers user successfully.", async () => {
  const response = await request(getHost(), mutation);
  expect(response).toEqual({ register: null });

  const users = await Users.find({ where: { email } });
  expect(users).toHaveLength(1);

  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(email);
});

test("It fails to registers user if email already exists.", async () => {
  const response: any = await request(getHost(), mutation);
  expect(response.register).toHaveLength(1);
  expect(response.register[0].path).toEqual("email");
});
