import Constants from "expo-constants";
import {
  Button,
  Container,
  Content,
  Icon,
  Left,
  List,
  ListItem,
  Right,
  Text,
} from "native-base";
import React, { useCallback } from "react";
import { TouchableOpacity } from "react-native";
import { NavigationScreenComponent } from "react-navigation";
import { useDispatch } from "react-redux";
import styled from "styled-components/native";
import { requestBundleUpdate } from "../store/app/actions";
import { useAuthentication } from "../hooks/useAuthentication";

const strings = {
  title: "設定",
  version: "バージョン",
  update: "更新",
  signOut: "サインアウト",
};

interface Params {}

export const SettingScreen: NavigationScreenComponent<Params> = ({
  navigation,
}) => {
  const { signOut } = useAuthentication(navigation);
  const { sdkVersion, revisionId } = Constants.manifest;
  const dispatch = useDispatch();
  const onPressUpdate = useCallback(() => {
    dispatch(requestBundleUpdate());
  }, [dispatch]);

  return (
    <Container>
      <Content>
        <List>
          <ListItem>
            <Left>
              <Text>{strings.version}</Text>
            </Left>
            <Content>
              <Text>{revisionId || sdkVersion}</Text>
            </Content>
            <Right>
              <TouchableOpacity onPress={onPressUpdate}>
                <LinkText>{strings.update}</LinkText>
              </TouchableOpacity>
            </Right>
          </ListItem>
          <ListItem>
            <Content>
              <TouchableOpacity onPress={signOut}>
                <DangerLinkText>{strings.signOut}</DangerLinkText>
              </TouchableOpacity>
            </Content>
          </ListItem>
        </List>
      </Content>
    </Container>
  );
};

SettingScreen.navigationOptions = ({ navigation }) => ({
  title: "設定",
  headerLeft: (
    <Button transparent onPress={() => navigation.openDrawer()}>
      <Icon name="menu" style={{ color: "white" }} />
    </Button>
  ),
});

const LinkText = styled(Text)`
  color: dodgerblue;
`;

const DangerLinkText = styled(Text)`
  color: crimson;
`;
