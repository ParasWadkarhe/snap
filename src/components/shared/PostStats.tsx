
import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";

type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const likesList = post?.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost ,isPending: isSavingPost} = useSavePost();
  const { mutate: deleteSavedPost,isPending: isDeletingSaved } = useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();
  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post?.$id === post?.$id
  );

  useEffect(()=>{
    setIsSaved(!!savedPostRecord);
  },[currentUser])

  const handleLikePost = async (e: React.MouseEvent) => {
    e.stopPropagation();
  
    const hasLiked = likes.includes(userId);
    let updatedLikes;
  
    if (hasLiked) {
      // User has already liked the post; remove the like
      updatedLikes = likes.filter((id: string) => id !== userId);
    } else {
      // User has not liked the post; add the like
      updatedLikes = [...likes, userId];
    }
  
    // Update state optimistically
    setLikes(updatedLikes);
  
    try {
      // Call backend to update likes
      await likePost({ postId: post?.$id || '', likesArray: updatedLikes });
    } catch (error) {
      console.error("Failed to update likes:", error);
  
      // Revert state if the backend update fails
      setLikes(likes);
    }
  };
  

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();

   

    if (savedPostRecord) {
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);
    } else {
      savePost({ postId: post?.$id || '', userId });
      setIsSaved(true);
    }
  };

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img
          src={
            checkIsLiked(likes, userId)
            ? "/assets/icons/liked.svg" // User has liked
            : "/assets/icons/like.svg" // User hasn't liked
          }
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
          alt="like "
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className="flex gap-2 ">
       { isSavingPost || isDeletingSaved ? <Loader/> : <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          width={20}
          height={20}
          onClick={handleSavePost}
          className="cursor-pointer"
          alt="like "
        />}
      </div>
    </div>
  );
};

export default PostStats;

// 4:08:00
