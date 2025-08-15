import { useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { setUserProfile } from "@/redux/authSlice";
import { USER_API } from "@/lib/const";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`${USER_API}/${userId}/profile`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.log("Fetch All posts error", error);
      }
    };
    fetchUserProfile();
  }, [userId]);
};
export default useGetUserProfile;
