import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function Banner({
   movies,
    loading,
    setActiveTab,
    setShowRoomData
  }: {
   movies: any[]; 
   loading: boolean;
   setActiveTab: (tab: 'Home' | 'Search' | 'Account' | 'Show') => void;
     setShowRoomData?: (data: any) => void;
  }) {
  const renderSkeletonBanner = () => (
    <View className="w-full h-[190px] bg-neutral-800 mt-6 animate-pulse" />
  );

  return loading ? (
    renderSkeletonBanner()
  ) : (
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
              setShowRoomData(item);
                setActiveTab('Show'); // Assuming setActiveTab is passed as a prop

              }}
            
          >
            <Animated.View entering={FadeIn.duration(600)} className="w-full h-full">
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w780${item.backdrop_path}` }}
                className="w-full h-full"
                resizeMode="cover"
              />

              {/* Gradient Overlay */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.95)']}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
              />

              {/* Banner Text */}
              <View className="absolute bottom-0 left-0 right-0 px-6 py-4">
                <Text className="text-white text-[20px] font-extrabold leading-tight mb-1">
                  {item.title || item.name}
                </Text>
                <Text
                  className="text-gray-300 text-[12px] leading-5"
                  numberOfLines={2}
                >
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
