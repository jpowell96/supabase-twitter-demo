
import AuthButtonServerComponent from './auth-button-server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from "next/navigation";
import NewTweet from './new-tweet'; 
import Tweets from './tweets';

/**  Exporting this to fix the DYNAMIC_SERVER_USAGE buiild error. 
 * By default, next is static rendered, but we want our page to be dynamic.
 * 
 * exporting this variable overrides that default static functionality, telling nextjs to make it dynamic.
 * 
 * More notes here:
 * https://nextjs.org/docs/messages/app-static-to-dynamic-error
 * 
*/

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  // Makes this a protected route. Only logged in users can access this
  if (session == null) {
    // Redirect to another page
    redirect("/login");
  }

  
  // When adding new types/columns, be sure to run: npx supabase gen types typescript --project-id izelvdghwffpbdnqgerb > lib/database.types.ts
  // To update the types
  // TODO: Update code to automaticcaly update the list when a new tweet is submitted
  // Reference Link: https://www.joshwcomeau.com/nextjs/refreshing-server-side-props/
  const { data } = await supabase
  .from("tweets")
  .select("*, author: profiles(*), likes(*)")
  .order('created_at', { ascending: false});

  const allTweets : TweetWithAuthor[] = data?.map(tweet => {
    return {
      ...tweet,
      author: Array.isArray(tweet.author) ? tweet.author[0] : tweet.author,
      user_has_liked_tweet: tweet.likes.find(like => like.user_id === session?.user.id),
      allLikes: tweet.likes.length
    } 
  }) ?? [];

  return (
  <div className="w-full max-w-xl mx-auto">
    <div className="flex justify-between px-4 py-6 border-gray-800 border-t-0">
      <h1 className="text-xl font-bold">Home</h1>
      <AuthButtonServerComponent />
    </div>
    <NewTweet user={session.user}/>
    <Tweets tweets={allTweets}/>
  </div>
  );
}
