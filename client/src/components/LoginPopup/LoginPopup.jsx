import React from "react";
import { useRef } from "react";
import { motion } from "framer-motion";
import SignIn from "../LoginPopup/SignIn";
import Login from "../LoginPopup/Login";

const LoginPopup = ({ loginPopup, toggleLoginPopup }) => {
  const loginPopupRef = useRef();
  const [showSignIn, setShowSignIn] = React.useState(false);

  const handleSignIn = () => {
    setShowSignIn(!showSignIn);
  };
  window.addEventListener("click", (e) => {
    if (loginPopupRef.current === e.target) {
      toggleLoginPopup();
    }
  });
  return (
    <>
      {loginPopup && (
        <div
          ref={loginPopupRef}
          className="h-screen w-screen fixed top-0 left-0 z-[20]
          backdrop-blur-lg bg-black/50 flex items-center justify-center"
        >
          <div
            className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          w-[90] items-center "
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl bg-white/10 
            backdrop-blur-md sm:w-[600px] md:w-[380px] shadow-custom-inset"
            >
              {showSignIn ? (
                <SignIn handleSignIn={handleSignIn} />
              ) : (
                <Login handleSignIn={handleSignIn} />
              )}
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPopup;
