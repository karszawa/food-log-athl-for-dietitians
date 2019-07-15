import React from "react";
import styled from "styled-components/native";
import { ActivityIndicator } from "react-native";

export const Loading = () => <ActivityIndicator size="large" />;

interface OverlayLoadingProps {
  isVisible: boolean;
}

export const OverlayLoading = ({ isVisible }: OverlayLoadingProps) =>
  isVisible ? (
    <Container>
      <Loading />
    </Container>
  ) : null;

const Container = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
`;
