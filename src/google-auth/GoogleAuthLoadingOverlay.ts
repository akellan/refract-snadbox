import { ObservableComponent, toProps, withEffects } from "refract-rxjs";
import { map } from "rxjs/operators";
import { ILoadingOverlayProps, LoadingOverlay } from "../common/components";
import { loadGoogleAuth } from "./GoogleAuth";

const aperture = (_: ObservableComponent, { clientId }: any) => {
  return loadGoogleAuth(clientId).pipe(map(() => toProps({ show: false })));
};

export const GoogleAuthLoadingOverlay = withEffects<
  ILoadingOverlayProps & { clientId: string },
  unknown
>(aperture)(LoadingOverlay);
