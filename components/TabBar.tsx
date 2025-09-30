import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const { width } = Dimensions.get('window');
const tabs = [
  { name: 'Home', icon: 'home-outline', iconActive: 'home' },
  { name: 'Search', icon: 'search-outline', iconActive: 'search' },
  { name: 'Live', icon: 'radio-outline', iconActive: 'radio' },
];
const TAB_WIDTH = width / tabs.length+1;

export default function TabBar({ activeTab,setActiveTab}:{ activeTab: "Home"|"Search"|"Live", setActiveTab: any}) {
  
  const insets = useSafeAreaInsets();
  const navBarHeight = insets.bottom;
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const index = tabs.findIndex((tab) => tab.name === activeTab);

    // Step 1: Shrink and fade out
    scale.value = withTiming(0.2, { duration: 50 });
    opacity.value = withTiming(0, { duration: 50 }, () => {
      // Step 2: Move position after shrink
      translateX.value = withTiming(activeTab=="Home"&&0|| activeTab=="Search"&&TAB_WIDTH-10 || activeTab=="Live"&&TAB_WIDTH*1.90, { duration: 0 });

      // Step 3: Restore size and opacity
      scale.value = withDelay(50, withTiming(1, { duration: 100 }));
      opacity.value = withDelay(50, withTiming(1, { duration: 100 }));
    });
  }, [activeTab]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value +1 },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <View
      className="bg-black border-t border-white/10 px-3 pt-2 pb-6"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: -4 },
        shadowRadius: 10,
        elevation: 8,
        left: 0,
        bottom: navBarHeight>0?navBarHeight-10:0,
      }}
    >
      {/* Animated pill background */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: TAB_WIDTH / 1.5,
            height: 60,
            borderTopLeftRadius: 100,
            borderTopRightRadius: 50,
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 100,
            backgroundColor: '#1F1F1F',
            zIndex: 0,
            left: 30,
            top: 0,
          },
          animatedStyle,
        ]}
      />

      {/* Tab Buttons */}
      {tabs.map((tab, index) => {
        const isActive = tab.name === activeTab;
        return (
          <TouchableOpacity
            key={tab.name}
            activeOpacity={0.8}
            className="flex-1 items-center"
            onPress={() => setActiveTab(tab.name)}
          >
            <View className="items-center justify-center z-10">
              <Icon
                name={isActive ? tab.iconActive : tab.icon}
                size={26}
                color={isActive ? '#fff' : '#999'}
              />
              <Text
                className={`text-xs mt-1 ${
                  isActive ? 'text-white font-semibold' : 'text-gray-400'
                }`}
              >
                {tab.name}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
