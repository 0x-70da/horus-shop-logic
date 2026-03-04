import {createClient} from "@supabase/supabase-js";
import dotenv from "dotenv";
import type { Database } from "../types/database.types.js";
dotenv.config();

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);