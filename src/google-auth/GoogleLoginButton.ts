import { ObservableComponent, toProps, withEffects } from "refract-rxjs";
import { concat, EMPTY, from, merge, of, pipe } from "rxjs";
import {
  catchError,
  map,
  startWith,
  switchMap,
  switchMapTo,
} from "rxjs/operators";
import { ILogInButtonProps, LogInButton } from "../common/components";
import { googleAuthApi } from "./GoogleAuth";

interface IGoogleAuthLogInButtonProps {
  googleApi: typeof googleAuthApi;
}

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

  const $logInEvenToProps = component.fromEvent("logIn").pipe(
    switchMapTo(
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
    switchMapTo(
      concat(
        of({ isLoading: true }),
        googleApi.getGoogleAuth().pipe(
          switchMap((googleAuth: gapi.auth2.GoogleAuth) =>
            from(googleAuth.signOut()),
          ),
          observeAuthState,
          catchError(() => EMPTY),
        ),
        of({ isLoading: false }),
      ),
    ),
    map(toProps),
  );

  return merge($isSignedIn, $logInEvenToProps, $logOutEventToProps);
};

export const GoogleAuthLogInButton = withEffects<
  IGoogleAuthLogInButtonProps,
  unknown,
  ILogInButtonProps
>(googleLogInApperture, { mergeProps: true })(LogInButton);
