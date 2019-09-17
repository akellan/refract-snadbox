import React from "react";
import { ObservableComponent, toProps, withEffects } from "refract-rxjs";
import { concat, from, merge, of, pipe, EMPTY } from "rxjs";
import {
  catchError,
  concatMapTo,
  map,
  mapTo,
  startWith,
  switchMap,
  switchMapTo,
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
  const observeAuthState = pipe(
    switchMapTo(googleApi.getGoogleAuth()),
    map((googleAuth: gapi.auth2.GoogleAuth) => ({
      isSignedIn: googleAuth.isSignedIn.get(),
      currentUser: googleAuth.currentUser.get(),
      isLoading: false,
    })),
  );

  const $isSignedIn = component.mount.pipe(
    observeAuthState,
    startWith({
      isSignedIn: false,
      currentUser: null,
      isLoading: true,
    }),
    map(toProps),
  );

  const $logOutEventStarted = component
    .fromEvent("logOut")
    .pipe(mapTo(toProps({ isLoading: true })));

  const $logInEvenToProps = component.fromEvent("logIn").pipe(
    concatMapTo(
      concat(
        of({ isLoading: true }),
        googleApi.getGoogleAuth().pipe(
          switchMap((googleAuth: gapi.auth2.GoogleAuth) =>
            from(googleAuth.signIn({ ux_mode: "popup" })),
          ),
          observeAuthState,
          catchError(() => EMPTY),
        ),
        of({ isLoading: false }),
      ),
    ),
    map(toProps),
  );

  const $logOutEventToProps = component.fromEvent("logOut").pipe(
    switchMapTo(googleApi.getGoogleAuth()),
    switchMap((googleAuth: gapi.auth2.GoogleAuth) =>
      from(googleAuth.signOut()),
    ),
    observeAuthState,
    map((data) => ({ ...data, isLoading: false })),
    map(toProps),
  );

  return merge(
    $isSignedIn,
    $logInEvenToProps,
    $logOutEventToProps,
    $logOutEventStarted,
  );
};

export const GoogleAuthLogInButton = withEffects<
  IGoogleAuthLogInButtonProps,
  unknown,
  ILogInButtonProps
>(googleLogInApperture, { mergeProps: true })(LogInButton);
