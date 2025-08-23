import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useFollowUnfollow from "../hooks/useGetFollowUnfollow";

const SuggestedUsers = () => {
  const { suggestedUsers, user } = useSelector((store) => store.auth);
  const { handleFollowUnfollow } = useFollowUnfollow();

  return (
    <div className="my-10">
      <div className="flex items-center justify-between gap-6 text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {suggestedUsers?.map((suggestedUser) => {
        const isFollowing = suggestedUser?.followers?.includes(user?._id);

        return (
          <div
            key={suggestedUser._id}
            className="flex items-center justify-between my-5"
          >
            <div className="flex items-center gap-2">
              <Link to={`/profile/${suggestedUser?._id}`}>
                <Avatar>
                  <AvatarImage src={suggestedUser?.profilePicture} alt="user_image" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="font-semibold text-sm">
                  <Link to={`/profile/${suggestedUser?._id}`}>
                    {suggestedUser?.username}
                  </Link>
                </h1>
                <span className="text-gray-600 text-sm">
                  {suggestedUser?.bio || "Bio here..."}
                </span>
              </div>
            </div>

            {/* Follow / Unfollow Button */}
            <button
              onClick={() => handleFollowUnfollow(suggestedUser?._id)}
              className={`text-xs font-bold cursor-pointer ${
                isFollowing
                  ? "text-black"
                  : "text-[#3BADF8] hover:text-[#3495d6]"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUsers;
