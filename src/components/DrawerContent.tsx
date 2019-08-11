import React from "react";
import { StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { DrawerItemsProps, DrawerItems, DrawerScene } from "react-navigation";

export const CustomDrawerContentComponent: React.ComponentType<
  DrawerItemsProps
> = props => {
  const { items, ...rest } = props;
  const filteredItems = items.filter(item =>
    routeNameToLabelMap.get(item.routeName)
  );

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <DrawerItems
          {...rest}
          items={filteredItems}
          getLabel={(scene: DrawerScene) =>
            routeNameToLabelMap.get(scene.route.routeName)
          }
        />
      </SafeAreaView>
    </ScrollView>
  );
};

const routeNameToLabelMap = new Map([
  ["Main", "選手一覧"],
  ["Unauth", "サインアウト"],
]);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
