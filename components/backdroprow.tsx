import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { options } from "../utils/options";


export default function BackdropRow({
  datas,
  type,
  title,
  url,
  setActiveTab,
  setShowRoomData
}: {
  datas?: any[];
  type: "movie" | "tv";
  title: string;
  url?: string;
  setActiveTab: (tab: 'Home' | 'Search' | 'Account' | 'Show') => void;
  setShowRoomData?: (data: any) => void;

}) {
  const [fetchedData, setFetchedData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!datas && url) {
      setLoading(true);
      fetch(url, options)
        .then((res) => res.json())
        .then((json) => {
          setFetchedData(json.results || []);
        })
        .catch((err) => {
          console.error("Error fetching:", err);
          setFetchedData([]);
        })
        .finally(() => setLoading(false));
    }else{
      setLoading(false)
    }
  }, [datas, url]);

  const dataToRender = datas ?? fetchedData;

  const filteredAndSortedData = (dataToRender || [])
    .filter((item) => item.backdrop_path)
    .sort((a, b) => {
      const dateA = new Date(a.release_date || a.first_air_date || "1900-01-01");
      const dateB = new Date(b.release_date || b.first_air_date || "1900-01-01");
      return dateB.getTime() - dateA.getTime();
    });

  const renderSkeletonCards = (count = 4) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5">
      {Array.from({ length: count }).map((_, idx) => (
        <View key={idx} className="mr-4 w-56">
          <View className="w-56 h-32 bg-neutral-800 rounded-md animate-pulse" />
          <View className="h-4 bg-neutral-700 rounded mt-2 mx-auto w-24 animate-pulse" />
        </View>
      ))}
    </ScrollView>
  );

  if (!loading && filteredAndSortedData.length === 0) return null;

  return (
    <View className="mt-4">
      <Text className="text-gray-300 text-xl font-semibold px-5 mb-3 tracking-wide">
        {title}
      </Text>

      {loading ? (
        renderSkeletonCards()
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5">
          {filteredAndSortedData.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              className="mr-4 w-56"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 5,
              }}
               onPress={() => {
                setShowRoomData({ ...item, media_type: type });
                setActiveTab('Show'); // Assuming setActiveTab is passed as a prop
                
                // Handle item press, e.g., navigate to details screen
              }}
            >
              <View className="rounded-md overflow-hidden bg-neutral-900">
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500${item.backdrop_path}`,
                  }}
                  className="w-56 h-32"
                  resizeMode="cover"
                />
              </View>
              <Text
                className="text-gray-400 text-sm mt-2 text-center font-medium px-1"
                numberOfLines={1}
              >
                {type === "movie" ? item.title : item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
