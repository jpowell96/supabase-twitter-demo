"use client";

import { createClientComponentClient, Session } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function AuthButtonClient({session}: {session: Session | null}) {
    // TODO: Add support for signing in with other providers

    const supabaseClient = createClientComponentClient<Database>();
    const router = useRouter();

    const handleLogin = async () => {
       await supabaseClient.auth.signInWithOAuth({ 
        provider: "github",  
        options: {
            redirectTo: `${location.origin}/auth/callback`,
            }
        });
    }

    const handleLogout = async () => {
        await supabaseClient.auth.signOut();
        // On signout, refresh the page to remove any stale data.
        router.refresh();
    };
        
    return   session ?  <button className="text-xs text-gray-400" onClick={handleLogout}>Logout</button> : <button className="text-xs text-gray-400" onClick={handleLogin}>Login</button>
}