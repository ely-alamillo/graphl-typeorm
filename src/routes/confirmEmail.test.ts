import fetch from "node-fetch";

it("It fails to confirm on bad id and responds with 'invalid'", async () => {
  const res = await fetch(`${process.env.TEST_HOST}/confirm/${1234}`);

  const text = await res.text();
  expect(text).toEqual("invalid");
});
