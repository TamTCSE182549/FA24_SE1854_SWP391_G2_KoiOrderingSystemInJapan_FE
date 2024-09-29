import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaSquareFacebook } from "react-icons/fa6";
const Login = ({ handleSignIn }) => {
  return (
    <>
      <div className="p-6">
        <h1
          className="text-3xl text-white font-bold
        text-center mb-4"
        >
          Login
        </h1>
        <form className="flex flex-col gap-3">
          <div>
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <input type="email" id="email" className="input" />
          </div>
          <div>
            <label htmlFor="email" className="input-label">
              Password
            </label>
            <input type="password" id="email-1" className="input" />
          </div>
        </form>
        <button className="primary-btn">Login</button>
        <p className="text-center text-white text-sm my-3">Or Login with</p>
        <div className="flex gap-6 justify-center">
          <div
            className="bg-white w-9 h-9 rounded-full flex items-center
          justify-center shadow-custom-inset hover:scale-110 transition-all duration-300"
          >
            <FcGoogle className="text-3xl" />
          </div>
          <div
            className="bg-white w-9 h-9 rounded-full flex items-center
          justify-center shadow-custom-inset hover:scale-110 transition-all duration-300"
          >
            <FaSquareFacebook className="text-3xl  " />
          </div>
        </div>
        <p
          className="text-center text-white text-sm my-3
        hover:text-cyan-600 cursor-pointer text-shadow"
          onClick={handleSignIn}
        >
          Don't have an account? Sign In
        </p>
      </div>
    </>
  );
};

export default Login;
