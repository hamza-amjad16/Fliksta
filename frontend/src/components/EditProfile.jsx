import React, { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const EditProfile = () => {
  const imageref = useRef();
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="flex max-w-2xl mx-auto pl-10">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="post_image" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div>
              <h1 className="font-bold text-sm">{user?.username}</h1>
              <span className="text-gray-600">
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>
          <input ref={imageref} type="file" className="hidden" />
          <Button
            onClick={() => imageref.current.click()}
            className="bg-[#0095F6] h-8 hover:bg-[#318bc7]"
          >
            Change Photo
          </Button>
        </div>
        <div>
          <h1 className="font-bold text-xl mb-2">Bio</h1>
          <Textarea name="bio" className="focus-visible:ring-transparent " />
        </div>
        <div>
          <h1 className="font-bold text-xl mb-2">Gender</h1>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
            <Button className="w-fit bg-[#0095F6]  hover:bg-[#318bc7]">Submit</Button>
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
