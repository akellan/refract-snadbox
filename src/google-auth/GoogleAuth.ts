import { Observable } from "rxjs";

export function getGoogleAuth() {
  return new Observable((subscriber) => {
    gapi.auth2.getAuthInstance().then((googleAuth) => {
      subscriber.next(googleAuth);
      subscriber.complete();
    });
  });
}

export function intiAuth2(clientId: string) {
  gapi.load("auth2", () => {
    gapi.auth2.init({ client_id: clientId });
  });
}
