import { generateNamespace } from "@gql2ts/from-schema";
import * as fs from "fs";
import * as path from "path";
import { genSchema } from "../utils/genSchema";

const types = generateNamespace("GQL", genSchema()).replace(
  /declare namespace GQL/gi,
  "export declare namespace GQL"
);

fs.writeFile(
  path.join(__dirname, "../types/schema.d.ts"),
  types,
  (err: NodeJS.ErrnoException) => console.log(err)
);
