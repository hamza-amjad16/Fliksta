import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { USER_API } from "@/lib/const";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(`${USER_API}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user))
        navigate("/");
        toast.success(res.data.message);
        setInput({
          username: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Loginerror", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={signupHandler}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">Fliksta</h1>
          <p className="text-sm text-center">
            Login to see photos & videos from your friends
          </p>
        </div>
        <div>
          <Label className="py-2">Email</Label>
          <Input
            type="email"
            name="email"
            className="focus-visible:ring-transparent"
            value={input.email}
            onChange={changeHandler}
          />
        </div>{" "}
        <div>
          <Label className="py-2">Password</Label>
          <Input
            type="password"
            name="password"
            className="focus-visible:ring-transparent"
            value={input.password}
            onChange={changeHandler}
          />
        </div>
        {loading ? (
          <Button>
            <Loader2 className="mr-2 h-4 w-4 animate-spin " />
            Please Wait
          </Button>
        ) : (
          <Button type="submit">Login</Button>
        )}
        <span>
          Don't have an account?{" "}
          <Link to={"/signup"} className="text-blue-600 ">
            Register
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
