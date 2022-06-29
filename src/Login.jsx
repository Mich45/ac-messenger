import { useRef } from 'react'
import { Link } from "react-router-dom";

import InputForm from "./InputForm.jsx";

const Login = () => {
  const userNameRef = useRef();
  const userPassRef = useRef();

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center p-4">
      <form
        onClick={handleLogin}
        className="w-full sm:w-96 flex flex-col gap-4 p-12 rounded-xl bg-white shadow-lg "
      >
        <label className="text-2xl text-left">Login</label>

        <InputForm label="Username" type="text" placeHolder="e.g example123" inputRef={userNameRef} />
        <InputForm label="Password" type="password" placeHolder="*********" inputRef={userPassRef} />

        <button className="bg-blue-500 hover:bg-blue-400 duration-300 rounded-xl p-2 px-4 text-white">
          Login
        </button>
        <p className="text-slate-600 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:text-blue-400 duration-300 font-semibold">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
