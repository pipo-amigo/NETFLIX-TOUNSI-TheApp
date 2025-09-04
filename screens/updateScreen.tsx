import React from "react";
import { View, Text, TouchableOpacity, Linking, Image } from "react-native";
import logo from "../assets/logo.png";
export default function UpdateScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      {/* Header */}
     

      {/* Logo */}
      <Image
        source={logo}
        style={{ width: 120, height: 120, resizeMode: "contain", marginBottom: 30 }}
      />

      {/* Update message */}
      <Text
        style={{
          color: "white",
          fontSize: 22,
          fontWeight: "bold",
          marginBottom: 15,
          textAlign: "center",
        }}
      >
        🚨 A New Update is Available!
      </Text>
      <Text
        style={{
          color: "gray",
          fontSize: 16,
          marginBottom: 30,
          textAlign: "center",
          lineHeight: 22,
        }}
      >
        Please download the latest version of the app to continue enjoying all features.
      </Text>

      {/* Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#E50914",
          paddingVertical: 15,
          paddingHorizontal: 40,
          borderRadius: 10,
          shadowColor: "#E50914",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.4,
          shadowRadius: 5,
          elevation: 5,
        }}
        onPress={() => Linking.openURL("https://net-flix-tounsi.netlify.app/")}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
          Download Update
        </Text>
      </TouchableOpacity>
    </View>
  );
}
