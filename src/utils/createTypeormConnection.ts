import { createConnection, getConnectionOptions } from "typeorm";

export const createTypeormConnection = async () => {
  const connectionOpts = await getConnectionOptions(process.env.NODE_ENV);
  return createConnection({ ...connectionOpts, name: "default" });
};
