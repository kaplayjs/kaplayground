export const prerender = false;

import type { APIRoute } from "astro";
import { prisma } from "../../../lib/prisma";
import { supabase } from "../../../lib/supabase";

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
    const authCode = url.searchParams.get("code");

    if (!authCode) {
        return new Response("No code provided", { status: 400 });
    }

    const { data, error } = await supabase.auth.exchangeCodeForSession(
        authCode,
    );

    if (error) {
        return new Response(error.message, { status: 500 });
    }

    const { access_token, refresh_token } = data.session;

    cookies.set("sb-access-token", access_token, {
        path: "/",
    });
    cookies.set("sb-refresh-token", refresh_token, {
        path: "/",
    });

    if (!data.user || !data.user?.email) {
        return redirect("/");
    }

    const findUser = await prisma.user.findUnique({
        where: {
            email: data.user?.email,
        },
    });

    if (!findUser) {
        await prisma.user.create({
            data: {
                authId: data.user?.id,
                email: data.user?.email,
                name: data.user?.user_metadata?.user_name,
            },
        });
    }

    return redirect("/");
};
