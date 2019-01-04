import { request } from "graphql-request";
import { host } from "./constants";
import { createConnection } from "typeorm";
import { Users } from "../entity/User";

const email = "tet@test.com";
const password = "password";

const mutation = `
mutation {
    register(email: "${email}", password: "${password}")
}
`;
test("add 1 + 2equals 3", async () => {
  const response = await request(host, mutation);
  expect(response).toEqual({ register: true });

  await createConnection();
  const users = await Users.find({ where: { email } });
  expect(users).toHaveLength(1);

  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(email);
});
