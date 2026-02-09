import { supabase } from "../../config/supabase.js";

export const getProfile = async (req: any, res: any) => {
  const userId = req.user.id;

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  res.json(data);
};
