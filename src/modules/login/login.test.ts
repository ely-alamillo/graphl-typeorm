import { request } from "graphql-request";
import { invalidLogin, confirmEmail } from "./errorMsg";
import { Users } from "../../entity/User";
import { createTypeormConnection } from "../../utils/createTypeormConnection";

const email = "test@test.com";
const password = "password";

const registerMutation = (userEmail: string, userPass: string) => {
  return `
mutation {
    register(email: "${userEmail}", password: "${userPass}") {
      path
      message
    }
}
`;
};

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

const loginError = async (e: string, p: string, msg: string) => {
  const res = await request(
    process.env.TEST_HOST as string,
    loginMutation(e, p)
  );

  expect(res).toEqual({
    login: [
      {
        path: "email",
        message: msg
      }
    ]
  });
};

beforeAll(async () => {
  await createTypeormConnection();
});

describe("Login user", () => {
  it("It fails to login with invalid email", async () => {
    await loginError("fail@fail.com", "password", invalidLogin);
  });

  it("It fails to login if email has not been confirmed", async () => {
    await request(
      process.env.TEST_HOST as string,
      registerMutation(email, password)
    );
    await loginError(email, password, confirmEmail);

    await Users.update({ email }, { confirmed: true });

    await loginError(email, "fail", invalidLogin);
  });

  //   it("It fails to login with invalid password", async () => {
  //     await loginError(email, "fail", invalidLogin);
  //   });
});
