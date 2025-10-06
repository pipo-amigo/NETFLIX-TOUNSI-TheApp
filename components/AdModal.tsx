import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type AdModalProps = {
  visible: boolean;
  onClose: () => void;
  apiUrl: string; // endpoint that returns array of image URLs
};

export default function AdModal({ visible, onClose, apiUrl }: AdModalProps) {
  const [ads, setAds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch ads when modal becomes visible
  useEffect(() => {
    if (visible) {
      fetchAds();
      
    }
  }, []);

  const fetchAds = async () => {
   fetch(apiUrl).then(res => res.json()).then(data => {
    setAds(data.ads || []);
    setCurrentIndex(0);
    console.log("Fetched ads:", data.ads);
  }).catch(err => {
    console.error("Failed to fetch ads:", err);
  }).finally(() => {
    setLoading(false);
  });
  }

  const handleNext = () => {
    if (currentIndex < ads.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose(); // really close after last ad
    }
  };

  // when pressing the ❌ button
  const handleClosePress = () => {
    handleNext();
  };

  return (
   <Modal visible={visible} transparent animationType="fade">
    <View style={styles.overlay}>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : ads.length > 0 ? (
        <View style={styles.adContainer}>
          {/* Close / Next button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClosePress}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>

          {/* Current ad */}
          <Image
            source={{ uri: ads[currentIndex] }}
            style={styles.adImage}
            resizeMode="cover"
          />
        </View>
      ) : (
        <ActivityIndicator size="large" color="#fff" />
      )}
    </View>
  </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  adContainer: {
    width: "90%",
    maxHeight: "90%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  adImage: {
    width: "100%",
    height:700,
    borderRadius: 12,
    objectFit: "contain",
  },
  closeButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 6,
    borderRadius: 20,
  },
});
