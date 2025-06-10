import {  } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";


export const db = drizzle({ client: sql, schema, casing: "snake_case" });
