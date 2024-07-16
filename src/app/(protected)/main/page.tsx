"use client"

import {useInfiniteQuery} from "@tanstack/react-query";
import {getPosts} from "@/app/api/post/postService";
import {Spinner} from "@/components/ui/spinner";
import PostVertical from "@/app/(protected)/post/_components/postVertical";
import Link from "next/link";
const fetchPosts = async ({pageParam = null}) => {
    const {posts, lastVisible} = await getPosts(pageParam);
    return {posts, nextPage: lastVisible};
};
export default function Main() {

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useInfiniteQuery({
            queryKey: ['posts'],
            queryFn: fetchPosts,
            getNextPageParam: (lastPage) => lastPage.nextPage || undefined,
            initialPageParam:null,
    })
    console.log("data = ", data);

    if (status === 'pending') return <Spinner loading={status === 'pending'}/>;
    if (status === 'error') return <p className={'absolute top-1/2 left-1/2'}>Error loading posts</p>;

    return (
        <div id={'main'}>
            <div className="flex justify-center">
                <div className="flex flex-col w-full">
                    {
                        data?.pages?.map((page, i) => (
                            <div key={i}>
                                {page.posts.map((post, j) => (
                                    <div key={post.id} >
                                        <Link href={`/post/${post.id}`} passHref>
                                            <PostVertical post={post} />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ))
                    }
                </div>
            </div>

        </div>
    );
}