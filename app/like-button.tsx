'use client';
import { createClientComponentClient, createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Database as DB } from "@/lib/database.types";

type Tweet = DB['public']['Tables']['tweets']['Row'];
type Profile = DB['public']['Tables']['profiles']['Row'];

interface LikeButtonProps {
    tweet: TweetWithAuthor,
    addOptimisticTweet: (newTweet: TweetWithAuthor) => void
}
export default function LikeButton({ tweet, addOptimisticTweet } : LikeButtonProps) {
    const router = useRouter();
    const handleLikesClick = async function () {
        const supabase = createClientComponentClient<Database>();
        const { data: {user}} = await supabase.auth.getUser();

        if (user) {
            // If user has already liked the tweet, delete the like
            if (!tweet.user_has_liked_tweet) { 
                addOptimisticTweet({
                    ...tweet,
                    allLikes: tweet.allLikes + 1,
                    user_has_liked_tweet: true
                });
                await supabase.from('likes').insert(
                {user_id: user.id , tweet_id: tweet.id});   
            } else {
                addOptimisticTweet({
                    ...tweet,
                    allLikes: tweet.allLikes - 1,
                    user_has_liked_tweet: false
                });
                await supabase.from('likes').delete().match({user_id: user.id , tweet_id: tweet.id});
            }
            router.refresh();
        }
    }

    return (<button type="submit"
        onClick={handleLikesClick}
        className="flex items-center group"
    >
    <svg xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`
    group-hover:fill-red-600 group-hover:stroke-red-600
    ${tweet.user_has_liked_tweet ? "fill-red-600 stroke-red-600" : "fill-none stroke-gray-500"}`}
    ><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
      <span className={`ml-2 text-sm group-hover:text-red-600  ${tweet.user_has_liked_tweet ? "text-red-600" : "text-gray-500"}`}>
        {tweet.allLikes || 0} 
      </span>
    </button>)
}