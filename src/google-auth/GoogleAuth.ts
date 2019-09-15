import { from, Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { loadScriptAsncDefer, observeGlobalFunction } from "../common";

export function getGoogleAuth() {
  return from(gapi.auth2.getAuthInstance());
}

export function loadGoogleAuth(clientId: string) {
  const globalFunctionName = "onLoadGooglePlaform";
  const $onGoglePlatformLoad = observeGlobalFunction(globalFunctionName);

  loadScriptAsncDefer(
    `https://apis.google.com/js/platform.js?onload=${globalFunctionName}`,
  ).subscribe({ error: console.error });

  return $onGoglePlatformLoad.pipe(switchMap(() => initAuth2(clientId)));
}

function initAuth2(clientId: string) {
  return new Observable((subscriber) => {
    gapi.load("auth2", () => {
      gapi.auth2.init({ client_id: clientId }).then((googleAuth) => {
        subscriber.next(googleAuth);
        subscriber.complete();
      }, subscriber.error);
    });
  });
}

export const googleAuthApi = {
  getGoogleAuth,
  loadGoogleAuth,
};
