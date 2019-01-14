import { Request, Response } from "express";
import { Users } from "../entity/User";
import { redis } from "../redis";

export const confirmEmail = async (req: Request, res: Response) => {
  const { id } = req.params;

  const userId = await redis.get(id);
  if (userId) {
    await Users.update({ id: id as string }, { confirmed: true });
    await redis.del(id);
    res.send("ok");
  } else {
    res.send("invalid");
  }
};
