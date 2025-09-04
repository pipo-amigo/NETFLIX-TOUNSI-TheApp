
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  Easing,
} from 'react-native-reanimated';
import { Ionicons, Feather } from '@expo/vector-icons';
import logo from '../assets/logo.png';

export default function Header({filter, setFilter}: {filter: 'movies' | 'tv' | null, setFilter: (value: 'movies' | 'tv' | null) => void }) {


  const animValue = useSharedValue(0);

  useEffect(() => {
    if (filter === 'movies') animValue.value = withTiming(1, { duration: 350, easing: Easing.out(Easing.cubic) });
    else if (filter === 'tv') animValue.value = withTiming(3, { duration: 350, easing: Easing.out(Easing.cubic) });
    else animValue.value = withTiming(0, { duration: 350, easing: Easing.out(Easing.cubic) });
  }, [filter]);

  const moviesStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animValue.value, [0, 1, 2], [1, 1, 0], Extrapolate.CLAMP);
    const scale = interpolate(animValue.value, [0, 1, 2], [1, 1.05, 0.9], Extrapolate.CLAMP);
    return { opacity, transform: [{ scale }] };
  });

  const tvStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animValue.value, [0, 1, 2], [1, 0, 1], Extrapolate.CLAMP);
    const scale = interpolate(animValue.value, [0, 1, 2], [1, 0.9, 1.05], Extrapolate.CLAMP);
    return { opacity, transform: [{ scale }] };
  });

  return (
    <View className="w-full bg-black px-5 pt-12 border-b border-white/10">
      {/* Top Row */}
      <View className="flex-row justify-between items-center mb-6">
        <Image source={logo} style={{ width: 100, height: 40, resizeMode: 'contain' }} />
       <View className="flex-row gap-3 justify-center ml-8 w-1/2">
        {/* Movies button */}
        <Animated.View style={[{ flex: 1, position: 'relative' }, moviesStyle]}>
          {filter === 'movies' && (
            <TouchableOpacity
              onPress={() => setFilter(null)}
              activeOpacity={0.7}
              className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-black/90 border border-white items-center justify-center shadow-lg z-10"
            >
              <Ionicons name="close" size={18} color="white" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => setFilter('movies')}
            activeOpacity={0.85}
            className={`py-2 rounded-full border items-center ${
              filter === 'movies'
                ? 'border-white bg-white'
                : 'border-white/20 bg-white/5'
            }`}
          >
            <Text
              className={`text-sm font-extrabold ${
                filter === 'movies' ? 'text-black' : 'text-white/80'
              }`}
            >
              Movies
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* TV Shows button */}
        <Animated.View style={[{ flex: 1, position: 'relative' }, tvStyle]}>
          {filter === 'tv' && (
            <TouchableOpacity
              onPress={() => setFilter(null)}
              activeOpacity={0.7}
              className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-black/90 border border-white items-center justify-center shadow-lg z-10"
            >
              <Ionicons name="close" size={18} color="white" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => setFilter('tv')}
            activeOpacity={0.85}
            className={`py-2 rounded-full border items-center ${
              filter === 'tv'
                ? 'border-white bg-white'
                : 'border-white/20 bg-white/5'
            }`}
          >
            <Text
              className={`text-sm font-extrabold ${
                filter === 'tv' ? 'text-black' : 'text-white/80'
              }`}
            >
              TV Shows
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      </View>

      
    </View>
  );
}
