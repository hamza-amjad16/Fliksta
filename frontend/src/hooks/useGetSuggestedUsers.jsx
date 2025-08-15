import { useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { setSuggestedUsers } from "@/redux/authSlice";
import { USER_API } from "@/lib/const";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get(`${USER_API}/suggessted`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        console.log("Fetch All posts error", error);
      }
    };
    fetchSuggestedUsers();
  }, []);
};
export default useGetSuggestedUsers;
