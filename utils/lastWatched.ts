import AsyncStorage from "@react-native-async-storage/async-storage";

const LAST_WATCHED_KEY = "last_watched";

// Save item (prepend so newest is first)
export const saveLastWatched = async (item: any) => {
  try {
    const stored = await AsyncStorage.getItem(LAST_WATCHED_KEY);
    let items = stored ? JSON.parse(stored) : [];

    // Remove duplicates by id
    items = items.filter((i: any) => i.id !== item.id);

    // Add to top
    items.unshift(item);

    // Keep max 10
    if (items.length > 10) items = items.slice(0, 10);

    await AsyncStorage.setItem(LAST_WATCHED_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Error saving last watched", e);
  }
};

export const getLastWatched = async () => {
  try {
    const stored = await AsyncStorage.getItem(LAST_WATCHED_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Error loading last watched", e);
    return [];
  }
};
