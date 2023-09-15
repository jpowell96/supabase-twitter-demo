'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";

export default function GithubButton() {
    const supabaseClient = createClientComponentClient<Database>();

    const handleLogin = async () => {
        await supabaseClient.auth.signInWithOAuth({ 
         provider: "github",  
         options: {
            redirectTo: `${location.origin}/auth/callback`,
             }
         });
     }

    return <button onClick={handleLogin}>
         <Image src="/github-mark-white.png" alt="Github Logo" 
         width="100" height="100"/>
         Sign In With GitHub
        </button>
}