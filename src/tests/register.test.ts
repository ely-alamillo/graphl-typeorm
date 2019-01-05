import { request } from "graphql-request";
import { host } from "./constants";
import { Users } from "../entity/User";
import { createTypeormConnection } from "../utils/createTypeormConnection";

const email = "tet@test.com";
const password = "password";

const mutation = `
mutation {
    register(email: "${email}", password: "${password}")
}
`;

beforeAll(async () => {
  await createTypeormConnection();
});

test("It registers user successfully.", async () => {
  const response = await request(host, mutation);
  expect(response).toEqual({ register: true });

  const users = await Users.find({ where: { email } });
  expect(users).toHaveLength(1);

  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(email);
});
