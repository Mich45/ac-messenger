import { Link } from "react-router-dom";

import InputForm from "./InputForm.jsx";

const SignUp = () => {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center p-4">
      <form
        action="#"
        className="w-full sm:w-96 flex flex-col gap-4 p-12 rounded-xl bg-white shadow-lg "
      >
        <label className="text-2xl text-left">Sign Up</label>

        <InputForm
          label="Email"
          type="email"
          placeHolder="e.g example@email.com"
        />
        <InputForm label="Username" type="text" placeHolder="e.g example123" />
        <InputForm label="Password" type="password" placeHolder="*********" />

        <button className="bg-blue-500 hover:bg-blue-400 duration-300 rounded-xl p-2 px-4 text-white">
          Sign Up
        </button>
        <p className="text-slate-600 text-sm">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-500 hover:text-blue-400 duration-300 font-semibold"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
