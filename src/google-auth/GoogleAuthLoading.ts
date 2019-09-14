import { ObservableComponent, toProps, withEffects } from "refract-rxjs";
import { map } from "rxjs/operators";
import { ILoadingOverlayProps, LoadingOverlay } from "./../common/components";

const aperture = (component: ObservableComponent) => {
  return component.observe("show").pipe(map((v) => toProps({ show: !v })));
};

export const LoadingGoogleAuthOverlay = withEffects<ILoadingOverlayProps, any>(
  aperture,
)(LoadingOverlay);
