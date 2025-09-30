import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Modal,
  Pressable,
  Dimensions,
  BackHandler
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";

import { options } from "../utils/options";
import WebPlayerModal from "../components/WebPlayerModal";
import { saveLastWatched } from "../utils/lastWatched"; // 🔥 added

const { width } = Dimensions.get("window");

export default function ShowRoom({
  setActiveTab,
  showRoomData,
  setShowRoomData,
  setDisableTabBar,
}: {
  setActiveTab: (tab: "Home" | "Search" | "Live" | "Show") => void;
  setDisableTabBar: (disabledTab: any) => any;
  showRoomData?: any;
  setShowRoomData: (data: any) => void;
}) {
  const [details, setDetails] = useState<any>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isTrailerVisible, setIsTrailerVisible] = useState(false);
  const [cast, setCast] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [PlayerRoom, setPlayerRoom] = useState(false);
  const isTV =
    showRoomData?.media_type === "tv" || !!showRoomData?.first_air_date;
  const scrollViewRef = useRef<ScrollView>(null);
  const [Episode, setEpisode] = useState(1);

  useEffect(() => {
    const backAction = () => {
      if (PlayerRoom) {
        setPlayerRoom(false);
        setDisableTabBar(true);
      } else {
        setActiveTab("Home");
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [PlayerRoom]);

  useEffect(() => {
    if (showRoomData?.id) {
      fetchDetails(showRoomData.id);
      fetchRecommendations(showRoomData.id);
      fetchEpisodes(1);
    }
  }, [showRoomData]);

  useEffect(() => {
    if (PlayerRoom) {
      setDisableTabBar(false);
      scrollToTop();
    }
  }, [PlayerRoom]);

  useEffect(() => {
    if (isTV && details?.seasons && selectedSeason) {
      fetchEpisodes(selectedSeason);
    }
  }, [selectedSeason, details]);

  // Fetch full details incl seasons, credits, videos
  const fetchDetails = async (id: number) => {
    try {
      setLoadingDetails(true);
      const type = isTV ? "tv" : "movie";
      const url = `https://api.themoviedb.org/3/${type}/${id}?language=en-US&append_to_response=videos,credits`;
      const res = await fetch(url, options);
      const data = await res.json();
      setDetails(data);

      if (isTV && data.seasons?.length > 0) {
        setSelectedSeason(data.seasons[0].season_number);
      }

      if (data.videos?.results?.length > 0) {
        const officialTrailer = data.videos.results.find(
          (vid: any) =>
            vid.type === "Trailer" &&
            vid.site === "YouTube" &&
            vid.official === true
        );
        const trailer =
          officialTrailer ||
          data.videos.results.find(
            (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
          );
        setTrailerKey(trailer?.key || null);
      }

      setCast(data.credits?.cast?.slice(0, 10) || []);
    } catch (err) {
      console.error("Failed to fetch details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Fetch episodes for a season
  const fetchEpisodes = async (seasonNumber: number) => {
    try {
      setLoadingEpisodes(true);
      const url = `https://api.themoviedb.org/3/tv/${showRoomData.id}/season/${seasonNumber}?language=en-US`;
      const res = await fetch(url, options);
      const data = await res.json();
      setEpisodes(data.episodes || []);
    } catch (err) {
      console.error("Failed to fetch episodes:", err);
      setEpisodes([]);
    } finally {
      setLoadingEpisodes(false);
    }
  };

  // Fetch recommendations
  const fetchRecommendations = async (id: number) => {
    try {
      setLoadingRecommendations(true);
      const type = isTV ? "tv" : "movie";
      const url = `https://api.themoviedb.org/3/${type}/${id}/recommendations?language=en-US&page=1`;
      const res = await fetch(url, options);
      const data = await res.json();
      setRecommendations(data.results || []);
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
      setRecommendations([]);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  if (!showRoomData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noDataText}>No data available</Text>
      </View>
    );
  }

  const seasons = details?.seasons || [];

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      style={{ backgroundColor: "#000" }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Banner */}
      <View style={styles.bannerContainer}>
        {PlayerRoom ? (
          isTV ? (
            <WebPlayerModal
              visible={true}
              onClose={() => setPlayerRoom(false)}
              embedUrl={`https://player.vidsrc.co/embed/tv/${showRoomData.id}/${selectedSeason}/${Episode}?dub=true&autoplay=true&autonext=true&nextbutton=true&poster=true&primarycolor=FF0000&secondarycolor=E14C62&iconcolor=FFFFFF&fontcolor=FFFFFF&fontsize=26px&opacity=0&font=Poppins`}
            />
          ) : (
            <WebPlayerModal
              visible={true}
              onClose={() => setPlayerRoom(false)}
              embedUrl={`https://player.vidsrc.co/embed/movie/${showRoomData.id}?dub=true&autoplay=true&autonext=true&nextbutton=true&poster=true&primarycolor=FF0000&secondarycolor=E14C62&iconcolor=FFFFFF&fontcolor=FFFFFF&fontsize=26px&opacity=0&font=Poppins`}
            />
          )
        ) : (
          <>
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/original${showRoomData.backdrop_path}`,
              }}
              style={styles.bannerImage}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)", "#000"]}
              style={styles.gradientOverlay}
            />
            {trailerKey && (
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => setIsTrailerVisible(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="play-circle" size={70} color="#fff" />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {/* Content */}
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>
          {showRoomData.title ||
            showRoomData.name ||
            showRoomData.original_name}
        </Text>
        {isTV && PlayerRoom && (
          <Text style={styles.episodeText}>Episode {Episode}</Text>
        )}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {showRoomData.release_date?.split("-")[0] ||
              showRoomData.first_air_date?.split("-")[0] ||
              "N/A"}
          </Text>

          {showRoomData.runtime && (
            <Text style={styles.metaText}>• {showRoomData.runtime} min</Text>
          )}

          {showRoomData.vote_average && (
            <Text style={styles.metaText}>
              • ⭐ {showRoomData.vote_average.toFixed(1)}
            </Text>
          )}
          {details?.genres?.length > 0 && (
            <Text style={[styles.metaText, { flexShrink: 1 }]}>
              • {details.genres.map((g: any) => g.name).join(", ")}
            </Text>
          )}
        </View>

        {!PlayerRoom && (
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.watchNowButton}
              onPress={() => {
                setPlayerRoom(true);

                // 🔥 Save movie/TV to storage
                saveLastWatched({
                  ...showRoomData,
                  media_type: isTV ? "tv" : "movie",
                  lastWatchedAt: Date.now(),
                  season: isTV ? selectedSeason : null,
                  episode: isTV ? Episode : null,
                });
              }}
            >
              <Ionicons name="play" size={20} color="#000" />
              <Text style={styles.watchNowText}>Watch Now</Text>
            </TouchableOpacity>
            {trailerKey && (
              <TouchableOpacity
                style={styles.trailerButton}
                onPress={() => setIsTrailerVisible(true)}
              >
                <Ionicons name="videocam-outline" size={20} color="#fff" />
                <Text style={styles.trailerText}>Trailer</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {PlayerRoom && (
          <Pressable
            onPress={() => {
              setPlayerRoom(false);
              setDisableTabBar(true);
            }}
            style={styles.arrowButton}
          >
            <Ionicons name="arrow-back" size={40} color="#fff" />
          </Pressable>
        )}

        <Text style={styles.overview}>{showRoomData.overview}</Text>

        {/* Seasons & Episodes */}
        {loadingDetails ? (
          <ActivityIndicator
            size="large"
            color="#888"
            style={{ marginTop: 30 }}
          />
        ) : (
          <>
            {isTV && seasons.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Seasons</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginVertical: 10 }}
                >
                  {seasons.map((season: any) => (
                    <TouchableOpacity
                      key={season.id}
                      style={[
                        styles.seasonPill,
                        selectedSeason === season.season_number &&
                          styles.seasonPillActive,
                      ]}
                      onPress={() => setSelectedSeason(season.season_number)}
                    >
                      <Text
                        style={[
                          styles.seasonPillText,
                          selectedSeason === season.season_number && {
                            color: "#000",
                          },
                        ]}
                      >
                        {season.name || `Season ${season.season_number}`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={styles.sectionTitle}>Episodes</Text>
                {loadingEpisodes ? (
                  <ActivityIndicator
                    size="small"
                    color="#888"
                    style={{ marginVertical: 10 }}
                  />
                ) : episodes.length > 0 ? (
                  <FlatList
                    data={episodes}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 12, paddingVertical: 10 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setEpisode(item.episode_number);
                          scrollToTop();
                          setPlayerRoom(true);

                          // 🔥 Save TV episode to storage
                          saveLastWatched({
                            ...showRoomData,
                            media_type: "tv",
                            lastWatchedAt: Date.now(),
                            season: selectedSeason,
                            episode: item.episode_number,
                            episodeName: item.name,
                          });
                        }}
                      >
                        <View style={styles.episodeCard}>
                          <Image
                            source={{
                              uri: item.still_path
                                ? `https://image.tmdb.org/t/p/w500${item.still_path}`
                                : "https://via.placeholder.com/500x281?text=No+Image",
                            }}
                            style={styles.episodeImage}
                          />
                          <Text style={styles.episodeTitle} numberOfLines={1}>
                            {item.episode_number}. {item.name}
                          </Text>
                          <Text style={styles.episodeDesc} numberOfLines={2}>
                            {item.overview || "No description available."}
                          </Text>
                          {item.runtime && (
                            <Text style={styles.episodeRuntime}>
                              ⏱ {item.runtime} min
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                ) : (
                  <Text style={{ color: "#888", marginVertical: 10 }}>
                    No episodes available
                  </Text>
                )}
              </>
            )}
          </>
        )}
      </View>
{/* Cast Section */}
{cast.length > 0 && (
  <>
    <Text style={styles.sectionTitle}>Cast</Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginVertical: 10 }}
    >
      {cast.map((member) => (
        <View key={member.id} style={styles.castCard}>
          <Image
            source={{
              uri: member.profile_path
                ? `https://image.tmdb.org/t/p/w300${member.profile_path}`
                : "https://via.placeholder.com/100x150?text=No+Image",
            }}
            style={styles.castImage}
          />
          <Text style={styles.castName} numberOfLines={1}>
            {member.name}
          </Text>
          <Text style={styles.castCharacter} numberOfLines={1}>
            as {member.character}
          </Text>
        </View>
      ))}
    </ScrollView>
  </>
)}

{/* Recommendations Section */}
{loadingRecommendations ? (
  <ActivityIndicator
    size="large"
    color="#888"
    style={{ marginVertical: 20 }}
  />
) : recommendations.length > 0 && (
  <>
    <Text style={styles.sectionTitle}>You May Also Like</Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginVertical: 10 }}
    >
      {recommendations.map((rec) => (
        <TouchableOpacity
          key={rec.id}
          style={styles.recommendationCard}
          onPress={() => {
            setShowRoomData(rec);
            scrollToTop();
          }}
        >
          <Image
            source={{
              uri: rec.poster_path
                ? `https://image.tmdb.org/t/p/w500${rec.poster_path}`
                : "https://via.placeholder.com/120x180?text=No+Image",
            }}
            style={styles.recommendationImage}
          />
          <Text style={styles.recommendationTitle} numberOfLines={1}>
            {rec.title || rec.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </>
)}
      {/* Trailer Modal */}
      <Modal
        visible={isTrailerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsTrailerVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <YoutubePlayer
              height={250}
              play={true}
              videoId={trailerKey || ""}
              onChangeState={(state) => {
                if (state === "ended") setIsTrailerVisible(false);
              }}
            />
            <Pressable
              style={styles.closeButton}
              onPress={() => setIsTrailerVisible(false)}
            >
              <Ionicons name="close-circle" size={36} color="#fff" />
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    color: "white",
    fontSize: 16,
  },
  bannerContainer: {
    width: "100%",
    height: 340,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    height: 150,
    width: "100%",
  },
  playButton: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 10,
    opacity: 0.85,
  },
  contentWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  metaText: {
    color: "#ccc",
    fontSize: 14,
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  watchNowButton: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    flex: 1,
    justifyContent: "center",
  },
  watchNowText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
  trailerButton: {
    borderColor: "#fff",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    flex: 1,
    justifyContent: "center",
  },
  trailerText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  overview: {
    color: "#ccc",
    fontSize: 15,
    lineHeight: 22,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 10,
  },
  seasonPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#222",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#444",
  },
  seasonPillActive: {
    backgroundColor: "#fff",
  },
  seasonPillText: {
    color: "#fff",
    fontWeight: "600",
  },
  episodeCard: {
    width: 220,
    backgroundColor: "#111",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  episodeImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  episodeTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 10,
    marginTop: 8,
  },
  episodeDesc: {
    color: "#aaa",
    fontSize: 13,
    paddingHorizontal: 10,
    paddingBottom: 4,
  },
  episodeRuntime: {
    color: "#888",
    fontSize: 12,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  castCard: {
    width: 120,
    marginRight: 10,
    alignItems: "center",
  },
  castImage: {
    width: 100,
    height: 150,
    borderRadius: 12,
    marginBottom: 6,
  },
  castName: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  castCharacter: {
    color: "#aaa",
    fontSize: 12,
    textAlign: "center",
  },
  recommendationCard: {
    width: 120,
    marginRight: 10,
  },
  recommendationImage: {
    width: 120,
    height: 180,
    borderRadius: 12,
    marginBottom: 6,
  },
  recommendationTitle: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: "#000",
    borderRadius: 12,
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },  arrowButton: {
    position: "absolute",
    top: 20,
    right: 8,
    zIndex: 10,
  },
  episodeText:{
    color:"grey",
    fontSize:20,
  paddingVertical:5,
  fontWeight: "bold",
  }
});
