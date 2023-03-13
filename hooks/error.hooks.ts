import React, { useState } from "react";

function useErrorHook() {
  const [error, setError] = useState<string>();
  const getErrors = (errorCode: string) => {
    switch (errorCode) {
      case "auth/wrong-password":
        setError("Incorrect email or password");
        break;
      case "auth/user-not-found":
        setError("Incorrect email or password");
        break;
      case "auth/network-request-failed":
        setError("Unstable network, please try again!");
        break;
      case "auth/email-already-in-use":
        setError("This email already exists");
        break;
      default:
        setError("Something went wrong, please try again!");
        break;
    }
  };

  return {
    getErrors,
    error,
  };
}

export default useErrorHook;
