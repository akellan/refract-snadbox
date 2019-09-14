import React from "react";

export interface ILoadingOverlayProps {
  show: boolean;
}

export const LoadingOverlay: FCE<ILoadingOverlayProps> = ({
  children,
  show,
}) => {
  return show ? <div>Loading...</div> : <>{children}</>;
};
