'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import LikeButton from "./like-button"
import { experimental_useOptimistic as useOptimistic, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Tweets({tweets} : { tweets : TweetWithAuthor[]}) {
    const router = useRouter();

    const supabase = createClientComponentClient();
    useEffect(() => {
        const channel = 
            supabase.channel("realtime_tweets")
                .on("postgres_changes", {
                    event: "*",
                    schema: "public",
                    table: "tweets",
                },
                (payload) => {
                    router.refresh();
                }
                ).subscribe();
        return () => {
            supabase.removeChannel(channel);
        }
    }, [supabase, router]);

    const [optimisticTweets, addOptimisticTweet] = useOptimistic<TweetWithAuthor[], TweetWithAuthor>(tweets,
            (currentOptimisticTweets, newTweet) => {
                const newOptimisticTweets = [...currentOptimisticTweets];
                const index = newOptimisticTweets.findIndex(tweet => tweet.id === newTweet.id);
                newOptimisticTweets[index] = newTweet;

                return newOptimisticTweets;
            }
        );
    
    return <>
    {
        optimisticTweets?.map(tweet => {
            return <div key={tweet.id}
                className="border-gray-800 border-top-0 px-4 py-8 flex"
            >
                <div className="h-12 w-12">
                    <Image 
                    className="rounded-full" 
                    src={tweet.author.avatar_url}
                    alt="tweet user avatar"
                    width={48}
                    height={48}
                    ></Image>
                </div>
                <div className="ml-4">
               <p>
                <span className="font-bold text-white">{tweet.author.name} </span>
                <span className="text-sm ml-2 text-gray-400">{tweet.author?.username}</span>
                </p>
                <p className="text-white">{tweet.title}</p>
               <LikeButton tweet={tweet} addOptimisticTweet={addOptimisticTweet}/>
               </div>
             </div>
           })
        }
           </>
    
}