import React, { FunctionComponent, useEffect } from "react";
import { registerGlobalFunction } from "../common";
import { loadScriptAsncDefer } from "../common/loadScript";
import { intiAuth2 } from "./GoogleAuth";

interface IGoogleAuthorizationInitProps {
  clientId: string;
}

export const GoogleAuthorizationInit: FunctionComponent<
  IGoogleAuthorizationInitProps
> = ({ children, clientId }) => {
  useEffect(() => {
    const globalFunctionName = "onLoadGooglePlaform";
    registerGlobalFunction(globalFunctionName, () => intiAuth2(clientId));

    const subscription = loadScriptAsncDefer(
      `https://apis.google.com/js/platform.js?onload=${globalFunctionName}`,
    ).subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [clientId]);

  return <>{children}</>;
};
