import * as Redis from "ioredis";
import fetch from "node-fetch";
import { createConfirmLink } from "./createConfirmLink";
import { createTypeormConnection } from "./createTypeormConnection";
import { Users } from "../entity/User";

let userId = "";
const testRedis = new Redis();

beforeAll(async () => {
  await createTypeormConnection();
  const user = await Users.create({
    email: "john@test.com",
    password: "password"
  }).save();
  userId = user.id;
});

describe("Email link works", async () => {
  it("It confirms user and clears key in redis", async () => {
    const url = await createConfirmLink(
      process.env.TEST_HOST as string,
      userId,
      testRedis
    );

    console.log({ url });
    const res = await fetch(url);
    console.log({ res });

    const text = await res.text();
    expect(text).toEqual("ok");

    const user = await Users.findOne({ where: { id: userId } });
    expect((user as Users).confirmed).toBeTruthy();

    const chunks = url.split("/");
    const key = chunks[chunks.length - 1];
    const value = await testRedis.get(key);
    expect(value).toBeNull();
  });
});
