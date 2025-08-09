import { POST_API } from "@/lib/const";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setPosts } from "@/redux/postSlice";
import axios from "axios";

const useGetAllPosts = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get(`${POST_API}/allpost`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setPosts(res.data.posts));
        }
      } catch (error) {
        console.log("Fetch All posts error", error);
      }
    };
    fetchAllPost();
  }, []);
};
export default useGetAllPosts;
