import React from "react";
import { ObservableComponent, toProps, withEffects } from "refract-rxjs";
import { from, merge, pipe } from "rxjs";
import {
  map,
  mapTo,
  mergeMap,
  mergeMapTo,
  retry,
  startWith,
} from "rxjs/operators";
import { googleAuthApi } from "./GoogleAuth";

interface ILogInButtonProps {
  currentUser: gapi.auth2.GoogleUser;
  isSignedIn: boolean;
  isLoading: boolean;
}

interface IGoogleAuthLogInButtonProps {
  googleApi: typeof googleAuthApi;
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

const googleLogInApperture = (
  component: ObservableComponent,
  { googleApi }: IGoogleAuthLogInButtonProps,
) => {
  const mapSignedInInfo = pipe(
    mergeMapTo(googleApi.getGoogleAuth()),
    map((googleAuth: gapi.auth2.GoogleAuth) => ({
      isSignedIn: googleAuth.isSignedIn.get(),
      currentUser: googleAuth.currentUser.get(),
      isLoading: false,
    })),
  );

  const $isSignedIn = component.mount.pipe(
    mapSignedInInfo,
    startWith({
      isSignedIn: false,
      currentUser: null,
      isLoading: true,
    }),
    map(toProps),
  );

  const $logInEventStarted = component
    .fromEvent("logIn")
    .pipe(mapTo(toProps({ isLoading: true })));

  const $logOutEventStarted = component
    .fromEvent("logOut")
    .pipe(mapTo(toProps({ isLoading: true })));

  const $logInEvenToProps = component.fromEvent("logIn").pipe(
    mergeMapTo(googleApi.getGoogleAuth()),
    mergeMap((googleAuth: gapi.auth2.GoogleAuth) =>
      from(googleAuth.signIn({ ux_mode: "popup" })),
    ),
    mapSignedInInfo,
    retry(),
    map((data) => ({ ...data, isLoading: false })),
    map(toProps),
  );

  const $logOutEventToProps = component.fromEvent("logOut").pipe(
    mergeMapTo(googleApi.getGoogleAuth()),
    mergeMap((googleAuth: gapi.auth2.GoogleAuth) => from(googleAuth.signOut())),
    mapSignedInInfo,
    map((data) => ({ ...data, isLoading: false })),
    map(toProps),
  );

  return merge(
    $isSignedIn,
    $logInEvenToProps,
    $logOutEventToProps,
    $logInEventStarted,
    $logOutEventStarted,
  );
};

export const GoogleAuthLogInButton = withEffects<
  IGoogleAuthLogInButtonProps,
  unknown,
  ILogInButtonProps
>(googleLogInApperture, { mergeProps: true })(LogInButton);
