import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View, Image, Text } from "react-native";
import { getLastWatched } from "../utils/lastWatched";

export default function LastWatchedRow({ setActiveTab, setShowRoomData }: any) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const stored = await getLastWatched();
    setItems(stored);
  };

  if (!items.length) return null;

  return (
    <View className="mt-4">
      <Text className="text-gray-300 text-xl font-semibold px-5 mb-3 tracking-wide">
        Continue Watching
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5">
        {items.map((item) => {
          const isTV = item?.media_type === "tv" || !!item?.first_air_date;
          const key = `${item.id}-${item.season ?? ""}x${item.episode ?? ""}`;

          return (
            <TouchableOpacity
              key={key}
              className="mr-3 w-44"
              onPress={() => {
                setShowRoomData(item);
                setActiveTab("Show");
              }}
            >
              <View className="h-64 rounded-md overflow-hidden bg-neutral-900">
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w342${item.poster_path}` }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              <Text className="text-white text-sm mt-2 text-center" numberOfLines={1}>
                {item.title || item.name}
              </Text>

              {isTV && (item.season || item.episode) ? (
                <Text className="text-gray-400 text-xs text-center" numberOfLines={1}>
                  S{item.season ?? "-"} • Ep {item.episode ?? "-"}
                </Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
