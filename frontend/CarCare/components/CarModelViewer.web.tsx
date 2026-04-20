import React from "react";
import { StyleSheet, Text, View } from "react-native";

type CarModelViewerProps = {
  modelAsset?: number;
};

export function CarModelViewer(_props: CarModelViewerProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>3D preview is available on iOS/Android.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    opacity: 0.6,
  },
});

