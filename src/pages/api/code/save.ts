export const prerender = false;

import type { Provider } from "@supabase/supabase-js";
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    return new Response("Saving project", { status: 200 });
};
