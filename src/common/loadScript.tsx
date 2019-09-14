import * as R from "ramda";
import { Observable } from "rxjs";

function loadScript(src: string, async: boolean, defer: boolean) {
  return new Observable((subscriber) => {
    const script = document.createElement("script");
    script.async = async;
    script.defer = defer;
    script.onload = function onload() {
      subscriber.next();
      subscriber.complete();
    };
    document.body.insertBefore(script, null);
    script.src = src;
  });
}

export const loadScriptAsncDefer = R.curry(loadScript)(R.__, true, true);
