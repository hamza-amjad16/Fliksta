import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign } from "lucide-react";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);

  const { userProfile } = useSelector((store) => store.auth);
  const isLogged = true;
  const follow = true;
  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilePhoto"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          {/* Information of user */}
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.username || "Hamza"}</span>
                {isLogged ? (
                  <>
                    <Button
                      variant={"secondary"}
                      className="hover:bg-gray-200 h-8 "
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant={"secondary"}
                      className="hover:bg-gray-200 h-8 "
                    >
                      View archive
                    </Button>
                    <Button
                      variant={"secondary"}
                      className="hover:bg-gray-200 h-8 "
                    >
                      Ad tools
                    </Button>
                  </>
                ) : follow ? (
                  <>
                    <Button variant={"secondary"} className="h-8 ">
                      Unfollow
                    </Button>
                    <Button variant={"secondary"} className=" h-8 ">
                      Message
                    </Button>
                  </>
                ) : (
                  <Button className="bg-[#0095F6] hover:bg-[#3192d2] h-8 ">
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts.length || "4"}{" "}
                  </span>
                  posts
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.followers.length || "10"}{" "}
                  </span>
                  followers
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.following.length || "7"}{" "}
                  </span>
                  following
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">
                  {userProfile?.bio || "Bio here..."}
                </span>
                <Badge variant={"secondary"} className={"w-fit"}>
                  <AtSign /> <span>{userProfile?.username || "Hamza"}</span>
                </Badge>
                <span>🧠 Learning coding with me</span>
                <span>🖥️ Full Stack Developer</span>
                <span>♾️ Eager to learn new technologies</span>
              </div>
            </div>
          </section>
        </div>
        {/* Post of Users */}
      </div>
    </div>
  );
};

export default Profile;
