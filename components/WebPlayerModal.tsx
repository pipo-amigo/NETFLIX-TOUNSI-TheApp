import React, { useEffect } from "react";
import {
  View,
  Modal,
  StyleSheet,
  Pressable,
  Platform,
  StatusBar,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
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
    if (visible) {
      // Lock to landscape for fullscreen feel
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      ).catch(console.log);
      StatusBar.setHidden(false);
    } else {
      // Unlock to default when closing
      ScreenOrientation.unlockAsync().catch(console.log);
      StatusBar.setHidden(false);
    }

    return () => {
      ScreenOrientation.unlockAsync().catch(console.log);
      StatusBar.setHidden(true);
    };
  }, [visible]);

  return (

      <View style={[styles.container, { width:"100%", height:340 }]}>
        <WebView
          source={{ uri: embedUrl }}
          allowsFullscreenVideo
          javaScriptEnabled
          domStorageEnabled
          mediaPlaybackRequiresUserAction={false}
          style={{ width:"100%", height:340 }}
        />

      </View>

  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    position: "absolute",
    top:0,
    zIndex:999,
    width:"100%",
    height:200
  },
  closeButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 50,
    left: 15,
    
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
  },
});
