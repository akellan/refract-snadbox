import React from "react";
import { ObservableComponent, toProps, withEffects } from "refract-rxjs";
import { from, merge, of, pipe } from "rxjs";
import { catchError, map, mergeMap, startWith, tap } from "rxjs/operators";
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
}) => {
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
  return <button onClick={pushEvent("logIn")}>Log In</button>;
};

const googleLogInApperture = (
  component: ObservableComponent,
  { googleApi }: IGoogleAuthLogInButtonProps,
) => {
  const mapSignedInInfo = pipe(
    mergeMap(() => googleApi.getGoogleAuth()),
    map((googleAuth: gapi.auth2.GoogleAuth) => ({
      isSignedIn: googleAuth.isSignedIn.get(),
      currentUser: googleAuth.currentUser.get(),
    })),
    map(toProps),
  );

  const $isSignedIn = component.mount.pipe(
    startWith({
      isSignedIn: false,
      currentUser: null,
    }),
    mapSignedInInfo,
  );

  const $logInEvenToProps = component.fromEvent("logIn").pipe(
    tap(console.info),
    mergeMap(() => googleApi.getGoogleAuth()),
    mergeMap((googleAuth: gapi.auth2.GoogleAuth) =>
      from(googleAuth.signIn({ ux_mode: "popup" })),
    ),
    catchError((error) => of(error)),
    tap(console.info),
    mapSignedInInfo,
    tap(console.info),
  );

  const $logOutEventToProps = component.fromEvent("logOut").pipe(
    mergeMap(() => googleApi.getGoogleAuth()),
    mergeMap((googleAuth: gapi.auth2.GoogleAuth) => from(googleAuth.signOut())),
    mapSignedInInfo,
  );

  return merge($isSignedIn, $logInEvenToProps, $logOutEventToProps);
};

export const GoogleAuthLogInButton = withEffects<
  IGoogleAuthLogInButtonProps,
  unknown,
  ILogInButtonProps
>(googleLogInApperture)(LogInButton);
