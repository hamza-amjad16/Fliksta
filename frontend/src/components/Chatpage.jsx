import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";

const Chatpage = () => {
  const { user, suggestedUsers, selectedUser } = useSelector((store) => store.auth);
  const isOnline = true;
  const dispatch = useDispatch()

  return (
    <div className="flex ml-[16%] h-screen ">
      <section>
        <h1 className="font-bold mb-4 px-3 text-xl ">{user?.username}</h1>
        <hr className="mb-4 border-gray-300 " />
        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers.map((suggesstedUser) => {
            return (
              <div onClick={() => dispatch(setSelectedUser(suggesstedUser))} className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer">
                <Avatar>
                  <AvatarImage src={suggesstedUser?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{suggesstedUser.username}</span>
                  <span
                    className={`text-xs font-bold ${
                      isOnline ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      
    </div>
  );
};

export default Chatpage;
