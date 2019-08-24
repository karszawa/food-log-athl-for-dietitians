import { NavigationScreenComponent } from "react-navigation";
import {
  Container,
  List,
  ListItem,
  Right,
  Left,
  Text,
  Content,
} from "native-base";
import React, { useCallback } from "react";
import Constants from "expo-constants";
import { useDispatch } from "react-redux";
import { Button } from "react-native-elements";
import { requestBundleUpdate } from "../store/app/actions";

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
      <Content>
        <List>
          <ListItem>
            <Left>
              <Text>バージョン</Text>
            </Left>
            <Right>
              <Text>{revisionId || sdkVersion}</Text>
            </Right>
          </ListItem>
        </List>

        <Button onPress={onPressUpdate} title={strings.update} type="clear" />
      </Content>
    </Container>
  );
};

SettingScreen.navigationOptions = { title: "設定" };
