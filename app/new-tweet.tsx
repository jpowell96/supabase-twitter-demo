import { User, createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function NewTweet({ user } : { user: User}) {
    const addTweet = async (formData: FormData) => {
        'use server';
        const supabase = createServerActionClient<Database>({ cookies });
        const title = String(formData.get("Title"));
            await supabase.from("tweets").insert({
                title, 
                user_id: user.id
            });
        
    }
    
    return (<form className="border border-gray-800 border-t-0" id="tweetForm" action={addTweet}>
        <div className="flex py-8 px-4">
            <div>
                <Image 
                src={user.user_metadata.avatar_url} 
                alt="user avatar" 
                width={48} 
                height={48}
                className="rounded-full"
                ></Image>
            </div>
        <input className="bg-inherit flex-1 ml-2 text-2xl leading-loose placeholder-gray-500" name="Title" placeholder="What is happening?"></input>
        </div>
       
    </form>)
}