import React from "react";
import { useSelector } from "react-redux";
import { OverlayLoading } from "./Loading";
import { RootState } from "../store";

export const ProgressOverlay: React.FC<{}> = ({ children }) => {
  const { isLoading } = useSelector((state: RootState) => state.app);

  return (
    <>
      {children}
      <OverlayLoading isVisible={isLoading} />
    </>
  );
};
