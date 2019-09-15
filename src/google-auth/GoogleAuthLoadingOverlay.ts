import { ObservableComponent, toProps, withEffects } from "refract-rxjs";
import { map, mergeMap, startWith } from "rxjs/operators";
import { ILoadingOverlayProps, LoadingOverlay } from "../common/components";
import { googleAuthApi } from "./GoogleAuth";

interface IGoogleAuthLoadingOverlayProps {
  googleApi: typeof googleAuthApi;
  clientId: string;
}

const aperture = (
  component: ObservableComponent,
  { clientId, googleApi }: IGoogleAuthLoadingOverlayProps,
) => {
  return component.mount.pipe(
    mergeMap(() => googleApi.loadGoogleAuth(clientId)),
    map(() => ({ show: false })),
    startWith({ show: true }),
    map(toProps),
  );
};

export const GoogleAuthLoadingOverlay = withEffects<
  IGoogleAuthLoadingOverlayProps,
  unknown,
  ILoadingOverlayProps
>(aperture)(LoadingOverlay);
