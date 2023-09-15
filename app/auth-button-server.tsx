import  AuthButtonClient from '@/auth-button';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/** 
 * AuthButton server component used to grab session on the server for the first render.
 * Therefore allowing the user to only see login, or logout button depending on their state.
 * 
 * 
 */
export const dynamic = 'force-dynamic';

export default async function authButtonServerComponent() {
    // 1. Create the supabase server component
    const supabase = createServerComponentClient<Database>({ cookies });

    // 2. Grab the session from auth
    const {data: {session}} = await supabase.auth.getSession();


    return <AuthButtonClient session={session}/>;
}