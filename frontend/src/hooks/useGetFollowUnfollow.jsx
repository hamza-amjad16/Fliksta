import { useDispatch } from "react-redux";
import { toggleFollow } from "../redux/authSlice"; // apne path ke hisab se
import axios from "axios";
import { toast } from "sonner";
import { USER_API } from "@/lib/const";

const useFollowUnfollow = () => {
  const dispatch = useDispatch();

  const handleFollowUnfollow = async (targetUserId) => {
    try {
      // 🔹 Backend API call
    const res =   await axios.post(
        `${USER_API}/followOrunfollow/${targetUserId}`,
        {},
        { withCredentials: true }
      );
       if(res.data.success){
        dispatch(toggleFollow(targetUserId))
        toast.success(res.data.message)
       }

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return { handleFollowUnfollow };
};

export default useFollowUnfollow;
