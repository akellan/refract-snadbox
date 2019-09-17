import React from "react";

export interface ILogInButtonProps {
  currentUser: gapi.auth2.GoogleUser;
  isSignedIn: boolean;
  isLoading: boolean;
}

export const LogInButton: FCE<ILogInButtonProps> = ({
  pushEvent,
  currentUser,
  isSignedIn,
  isLoading,
}) => {
  console.info({
    pushEvent,
    currentUser,
    isSignedIn,
    isLoading,
  });
  if (isSignedIn) {
    return (
      <div>
        {currentUser.getBasicProfile().getName()}
        <img
          alt="Profile icon"
          src={currentUser.getBasicProfile().getImageUrl()}
        />
        <button onClick={pushEvent("logOut")}>Log Out</button>
      </div>
    );
  }
  return !isLoading ? (
    <button onClick={pushEvent("logIn")}>Log In</button>
  ) : (
    <div>Loading...</div>
  );
};
