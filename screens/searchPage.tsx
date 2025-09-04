

import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Keyboard,
  Pressable,
  BackHandler
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import TVxMovie from '../components/TVxMovie';
import { options } from '../utils/options';

const { width } = Dimensions.get('window');

export default function SearchPage({setActiveTab,setShowRoomData}: { setActiveTab: (tab: 'Home' | 'Search' | 'Account' | 'Show') => void; setShowRoomData: (data: any) => void }) {
  const [query, setQuery] = useState('');
  const [movieResults, setMovieResults] = useState<any[]>([]);
  const [tvResults, setTvResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

   useEffect(() => {
    const backAction = () => {
      setActiveTab("Home")
      return true; // block default behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const fetchSearchResults = async (text: string) => {
    if (!text.trim()) {
      setMovieResults([]);
      setTvResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
          text
        )}&include_adult=false&language=en-US&page=1`,
        options
      );
      const data = await res.json();
      const allResults = data.results || [];

      setMovieResults(allResults.filter((item) => item.media_type === 'movie'));
      setTvResults(allResults.filter((item) => item.media_type === 'tv'));
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSearchResults(query);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleClear = () => {
    setQuery('');
    setMovieResults([]);
    setTvResults([]);
    Keyboard.dismiss();
  };

  return (
    <View className="flex-1 bg-black">
      <Pressable onPress={Keyboard.dismiss} className="flex-1">
        {/* Search Bar */}
        <View className="pt-12 px-4 pb-3 bg-black">
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#1e1e1e',
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: '#2a2a2a',
              shadowColor: '#000',
              shadowOpacity: 0.15,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 10,
            }}
          >
            <Icon name="search-outline" size={20} color="#aaa" />
            <TextInput
              placeholder="Search movies or TV shows..."
              placeholderTextColor="#888"
              value={query}
              onChangeText={setQuery}
              autoFocus
              style={{
                flex: 1,
                color: 'white',
                fontSize: 16,
                marginLeft: 10,
              }}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={handleClear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Icon name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {
          query.length == 0 && (
            <View className='flex-1'>
              <TVxMovie 
                  setActiveTab={setActiveTab}
                  setShowRoomData={setShowRoomData}
                    key="popular-movies"
                    url="https://api.themoviedb.org/3/movie/popular?language=en-US&page=1"
                    title="Popular Movies"
                    type="movie"
                  />
                    <TVxMovie 
                        setActiveTab={setActiveTab}
                        setShowRoomData={setShowRoomData}
                          key="top-rated-movies"
                          url="https://api.themoviedb.org/3/tv/popular?language=en-US&page=1"
                          title="Popular TV Shows"
                          type="tv"
                        />
            </View>
          )
        }
        {/* Loading State */}
        {loading && (
          <View className="flex-1 items-center justify-center mt-20">
            <ActivityIndicator size="large" color="#ffffff" />
            <Text className="text-white mt-4 text-base">Searching results...</Text>
          </View>
        )}

        {/* Empty State */}
        {!loading && query.length > 0 && movieResults.length === 0 && tvResults.length === 0 && (
          <View className="flex-1 items-center justify-center mt-20 px-4">
            <Text className="text-white text-lg text-center">
              No results found for "{query.trim()}".
            </Text>
            <Text className="text-neutral-400 text-sm mt-2 text-center">
              Try a different keyword or check your spelling.
            </Text>
          </View>
        )}

        {/* Results */}
        {!loading && (movieResults.length > 0 || tvResults.length > 0) && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {movieResults.length > 0 && (
              <TVxMovie setActiveTab={setActiveTab} setShowRoomData={setShowRoomData} datas={movieResults} type="movie" title="🎬 Movie Results" />
            )}
            {tvResults.length > 0 && (
              <TVxMovie setActiveTab={setActiveTab} setShowRoomData={setShowRoomData} datas={tvResults} type="tv" title="📺 TV Show Results" />
            )}
          </ScrollView>
        )}
      </Pressable>
    </View>
  );
}
