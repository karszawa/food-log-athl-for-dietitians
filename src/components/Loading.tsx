import React from "react";
import styled from "styled-components/native";
import { ActivityIndicator } from "react-native";

export const Loading = () => <ActivityIndicator size="large" />;

export const OverlayLoading = () => (
  <Container>
    <Loading />
  </Container>
);

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
