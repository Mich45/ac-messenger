import { useRef, useState, useContext, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { UserContext } from "/src/setup/app-context-manager";
import { useLocalStorage } from "/src/common/hooks";

import { useAuth } from "./hooks";
import { SignIn, SignUp } from "./components";

const Authentication = ({
  setKeepSignedIn,
  keepSignedIn,
  setPendingMsg,
  pendingMsg,
}) => {
  const [isSigningIn, setIsSigningIn] = useState(true);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-[90%] sm:w-[25rem] h-[700px] relative overflow-x-hidden flex items-center justify-center">
        <AnimatePresence>
          {isSigningIn && (
            <motion.div
              key="signin-form"
              className="absolute w-[90%] sm:w-96 "
              initial={{ x: "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-50%", opacity: 0 }}
              transition={{ type: "spring", mass: 0.25 }}
            >
              {" "}
              <SignIn
                setKeepSignedIn={setKeepSignedIn}
                setIsSigningIn={setIsSigningIn}
                setPendingMsg={setPendingMsg}
                keepSignedIn={keepSignedIn}
                pendingMsg={pendingMsg}
              />
            </motion.div>
          )}
          {!isSigningIn && (
            <motion.div
              key="signup-form"
              className="absolute w-[90%] sm:w-96"
              initial={{ x: "50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "50%", opacity: 0 }}
              transition={{ type: "spring", mass: 0.25 }}
            >
              <SignUp
                setPendingMsg={setPendingMsg}
                setIsSigningIn={setIsSigningIn}
                pendingMsg={pendingMsg}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Authentication;