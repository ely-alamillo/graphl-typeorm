import { request } from "graphql-request";
import { Users } from "../../entity/User";
import { startServer } from "../../startServer";
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough
} from "./errorMsg";

const email = "test@test.com";
const password = "password";

let getHost = () => "";

const mutation = (userEmail: string, userPass: string) => {
  return `
mutation {
    register(email: "${userEmail}", password: "${userPass}") {
      path
      message
    }
}
`;
};

beforeAll(async () => {
  const app = await startServer();
  const { port } = app.address() as any;
  getHost = () => `http://127.0.0.1:${port}`;
});

describe("Register user", async () => {
  it("It register user successfully.", async () => {
    const response = await request(getHost(), mutation(email, password));
    expect(response).toEqual({ register: null });

    const users = await Users.find({ where: { email } });
    expect(users).toHaveLength(1);

    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(email);
  });

  it("It fails to register user if email already exists.", async () => {
    const response: any = await request(getHost(), mutation(email, password));
    expect(response.register).toHaveLength(1);
    expect(response.register[0]).toEqual({
      path: "email",
      message: duplicateEmail
    });
  });

  it("It fails to register user with bad email.", async () => {
    const response: any = await request(getHost(), mutation("on", password));
    expect(response.register).toHaveLength(2);
    expect(response).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough
        },
        { path: "email", message: invalidEmail }
      ]
    });
  });

  it("It fails to register user with bad password.", async () => {
    const response: any = await request(getHost(), mutation(email, "pa"));
    expect(response.register).toHaveLength(1);
    expect(response).toEqual({
      register: [{ path: "password", message: passwordNotLongEnough }]
    });
  });

  it("It fails to register user with bad password and bad email.", async () => {
    const response: any = await request(getHost(), mutation("em", "pa"));
    expect(response.register).toHaveLength(3);
    expect(response).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough
        },
        { path: "email", message: invalidEmail },
        { path: "password", message: passwordNotLongEnough }
      ]
    });
  });
});

// maybe add tests to test max lenght
