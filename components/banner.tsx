import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import React, { useEffect, useState } from 'react';

const { width } = Dimensions.get('window');

export default function Banner({
  movies,
  loading,
  setActiveTab,
  setShowRoomData,
}: {
  movies: any[];
  loading: boolean;
  setActiveTab: (tab: 'Home' | 'Search' | 'Account' | 'Show') => void;
  setShowRoomData?: (data: any) => void;
}) {
  const renderSkeletonBanner = () => (
    <View className="w-full h-[190px] bg-neutral-800 mt-6 animate-pulse" />
  );

  if (loading) return renderSkeletonBanner();

  // 👉 If running on web, render custom HTML/CSS slideshow
  if (Platform.OS === 'web') {
    return <WebBanner movies={movies} setActiveTab={setActiveTab} setShowRoomData={setShowRoomData} />;
  }

  // 👉 Mobile carousel
  return (
    <View className="mt-0">
      <Carousel
        loop
        autoPlay
        autoPlayInterval={5000}
        data={movies}
        width={width}
        height={190}
        scrollAnimationDuration={800}
        style={{ alignSelf: 'center' }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.9}
            className="overflow-hidden"
            onPress={() => {
              setShowRoomData?.(item);
              setActiveTab('Show');
            }}
          >
            <Animated.View entering={FadeIn.duration(600)} className="w-full h-full">
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w780${item.backdrop_path}` }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.95)']}
                style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
              />
              <View className="absolute bottom-0 left-0 right-0 px-6 py-4">
                <Text className="text-white text-[20px] font-extrabold leading-tight mb-1">
                  {item.title || item.name}
                </Text>
                <Text className="text-gray-300 text-[12px] leading-5" numberOfLines={2}>
                  {item.overview}
                </Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// 🔹 Web-only slideshow
function WebBanner({ movies, setActiveTab, setShowRoomData }: any) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % movies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [movies.length]);

  return (
    <div
      style={{
        width: '100%',
        height: 190,
        position: 'relative',
        overflow: 'hidden',
        marginTop: 8,
      }}
    >
      {movies.map((m: any, i: number) => (
        <div
          key={i}
          onClick={() => {
            setShowRoomData?.(movies[index]);
            setActiveTab('Show');
          }}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: i === index ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            cursor: 'pointer',
          }}
        >
          <img
            src={`https://image.tmdb.org/t/p/w780${m.backdrop_path}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6), rgba(0,0,0,0.95))',
            }}
          />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 24px' }}>
            <div style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 4 }}>
              {m.title || m.name}
            </div>
            <div style={{ fontSize: 12, color: '#ccc' }}>{m.overview}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
