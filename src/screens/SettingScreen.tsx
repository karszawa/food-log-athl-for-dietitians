import { NavigationScreenComponent } from "react-navigation";
import {
  Container,
  List,
  ListItem,
  Right,
  Left,
  Text,
  Content,
  Button,
} from "native-base";
import React, { useCallback } from "react";
import Constants from "expo-constants";
import { useDispatch } from "react-redux";
import {
  REQUEST_BUNDLE_UPDATE,
  requestBundleUpdate,
} from "../store/app/actions";

const strings = {
  title: "設定",
  version: "バージョン",
  update: "アプリの更新を確認して更新する",
};

interface Params {}

export const SettingScreen: NavigationScreenComponent<Params> = () => {
  const { sdkVersion, revisionId } = Constants.manifest;
  const dispatch = useDispatch();
  const onPressUpdate = useCallback(() => {
    dispatch(requestBundleUpdate());
  }, [dispatch]);

  return (
    <Container>
      <List>
        <ListItem>
          <Left>
            <Text>バージョン</Text>
          </Left>
          <Right>
            <Text>{revisionId || sdkVersion}</Text>
          </Right>
        </ListItem>
        <ListItem>
          <Content>
            <Button onPress={onPressUpdate} transparent>
              <Text>{strings.update}</Text>
            </Button>
          </Content>
        </ListItem>
      </List>
    </Container>
  );
};

SettingScreen.navigationOptions = { title: "設定" };
