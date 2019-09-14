import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { loadScriptAsncDefer, registerGlobalFunction } from "../common";

export function getGoogleAuth() {
  return new Observable((subscriber) => {
    gapi.auth2.getAuthInstance().then((googleAuth) => {
      subscriber.next(googleAuth);
      subscriber.complete();
    });
  });
}

export function loadGoogleAuth(clientId: string) {
  const globalFunctionName = "onLoadGooglePlaform";
  const $onGoglePlatformLoad = registerGlobalFunction(globalFunctionName);

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
