import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

/**
 * This middleware is used to refresh the cookie on requests 
 * if it's expired. 
 * 
 * Calling getSession() will refresh the cookie if it's expired.
 * @param req 
 * 
 * @returns res
 */
export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient<Database>({ req, res});
    await supabase.auth.getSession();
    return res;
}