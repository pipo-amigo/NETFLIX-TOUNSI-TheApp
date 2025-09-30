import React, { useEffect } from "react";
import {
  View,
  Modal,
  StyleSheet,
  Pressable,
  Platform,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import * as ScreenOrientation from "expo-screen-orientation";

export default function WebPlayerModal({
  visible,
  onClose,
  embedUrl,
}: {
  visible: boolean;
  onClose: () => void;
  embedUrl: string;
}) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  useEffect(() => {
    if (Platform.OS !== "web") {
      if (visible) {
        ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        ).catch(console.log);
        StatusBar.setHidden(false);
      } else {
        ScreenOrientation.unlockAsync().catch(console.log);
        StatusBar.setHidden(false);
      }

      return () => {
        ScreenOrientation.unlockAsync().catch(console.log);
        StatusBar.setHidden(true);
      };
    }
  }, [visible]);

  return (
    <View style={[styles.container, { width: "100%", height: 340 }]}>
      {Platform.OS === "web" ? (
        <iframe
          src={embedUrl}
          style={{ width: "100%", height: "100%", border: "none" }}
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture"
        />
      ) : (
        <WebView
          source={{ uri: embedUrl }}
          allowsFullscreenVideo
          javaScriptEnabled
          domStorageEnabled
          mediaPlaybackRequiresUserAction={false}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    position: "absolute",
    top: 0,
    zIndex: 999,
  },
});
