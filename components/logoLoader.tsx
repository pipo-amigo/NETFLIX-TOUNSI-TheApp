import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Easing, StyleSheet, Text } from 'react-native';
import loadingIcon from '../assets/NTlogo.png';

type LogoLoaderProps = {
  messages?: string;

};

export default function LogoLoader({
  messages = 'Loading...',

}: LogoLoaderProps) {

  return (
    <View  className='flex justify-center items-center w-full h-full'>
      <Animated.Image
        source={loadingIcon}
        className={"animate-pulse w-40 h-40 rounded-lg"}
        
      />
      <Text className='text-white font-thin '>{messages}</Text>
    </View>
  );
}

