import { MESSAGE_API } from "@/lib/const";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const useGetAllMessages = () => {
  const dispatch = useDispatch();
  const {selectedUser} = useSelector(store => store.auth)
  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        const res = await axios.get(`${MESSAGE_API}/all/${selectedUser?._id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setMessages(res.data.messages));
        }
      } catch (error) {
        console.log("Fetch All messages error", error);
      }
    };
    fetchAllMessages();
  }, []);
};
export default useGetAllMessages;
