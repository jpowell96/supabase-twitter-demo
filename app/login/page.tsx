import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import AuthButtonServerComponent from "../auth-button-server"
import { cookies } from 'next/headers'
import { redirect } from "next/navigation";
import AuthButtonClient from "@/auth-button";
import GithubButton from "./github-button";

export const dynamic = 'force-dynamic';
export default async function LoginPage() {
    const supabase = createServerComponentClient<Database>({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
        // Redirect to another page
        redirect("/");
    }
    return <>
        <GithubButton />
    </>
}