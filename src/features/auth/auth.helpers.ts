import { supabase } from "../../config/supabase.js";
import logger from "../../utils/logger.js";

export const clearRefreshTokenFromDb = async (userId: string) => {
    const { error } = await supabase.from("users").update({ refresh_token: null }).eq("id", userId);
    if (error) {
        logger("Error clearing refresh token from database for user ID:", userId, "Error:", error);
        throw new Error("Error clearing refresh token from database");
    }
}