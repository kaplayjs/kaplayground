export const prerender = false;

import type { Provider } from "@supabase/supabase-js";
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, redirect, url }) => {
    const formData = await request.formData();
    const provider = formData.get("provider")?.toString();

    const validProviders = ["github"];

    if (provider && validProviders.includes(provider)) {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider as Provider,
            options: {
                redirectTo: `${url.origin}/api/auth/callback`,
            },
        });

        if (error) {
            return new Response(error.message, { status: 500 });
        }

        return redirect(data.url);
    } else {
        return new Response("Invalid provider", { status: 400 });
    }
};
