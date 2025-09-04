import '../global.css';
import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import LastWatchedRow from "../components/LastWatchedRow";
import Header from '../components/Header';
import Banner from '../components/banner';
import TVxMovie from '../components/TVxMovie';
import BackdropRow from '../components/backdroprow';
import TheMovies from '../components/TheMovies';
import TheSeries from '../components/TheSeries';
import { options } from '../utils/options';

const { width } = Dimensions.get('window');

// Helper function to shuffle an array
const shuffleArray = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};

export default function HomePage({setActiveTab,setShowRoomData}: {setActiveTab: (tab: 'Home' | 'Search' | 'Account' | 'Show') => void; setShowRoomData: (data: any) => void}) {
  const [movies, setMovies] = useState([]);
  const [tvShows, setTVShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'movies' | 'tv' | null>(null);
  const [randomRows, setRandomRows] = useState<JSX.Element[]>([]);

  const fetchTrending = async () => {
    try {
      const movieRes = await fetch('https://api.themoviedb.org/3/trending/movie/week', options);
      const tvRes = await fetch('https://api.themoviedb.org/3/trending/tv/week', options);

      const movieData = await movieRes.json();
      const tvData = await tvRes.json();

      setMovies(movieData.results || []);
      setTVShows(tvData.results || []);
    } catch (error) {
      console.error('Error fetching trending data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      // Regenerate rows when data is fetched
    }
  };

  useEffect(() => {
     generateRandomRows();
    fetchTrending();
  }, []);

  const generateRandomRows = () => {
    const rows = [
      <BackdropRow
      setActiveTab={setActiveTab} setShowRoomData={setShowRoomData}
        key="playing-now"
        url="https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1"
        title="Playing Now"
        type="movie"
      />,
      <BackdropRow setActiveTab={setActiveTab} setShowRoomData={setShowRoomData}
        key="top-rated-tv"
        url="https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1"
        title="Top Rated TV Shows"
        type="tv"
      />,
      <TVxMovie 
      setActiveTab={setActiveTab}
      setShowRoomData={setShowRoomData}
        key="top-rated-movies"
        url="https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1"
        title="Top Rated Movies"
        type="movie"
      />,
      <BackdropRow setActiveTab={setActiveTab}
      setShowRoomData={setShowRoomData}
        key="top-picks"
        url="https://api.themoviedb.org/3/trending/tv/day?language=en-US"
        title="Top Picks for You"
        type="tv"
      />,
      <BackdropRow setActiveTab={setActiveTab} setShowRoomData={setShowRoomData}
        key="discover"
        url="https://api.themoviedb.org/3/trending/tv/day?language=en-US&page=2"
        title="Discover"
        type="tv"
      />,
    ];

    const shuffled = shuffleArray(rows);
    setRandomRows(shuffled);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTrending(); // This will call generateRandomRows at the end
  }, []);

  const renderContent = () => {
    switch (filter) {
      case 'movies':
        return <TheMovies setFilter={setFilter}  setActiveTab={setActiveTab} setShowRoomData={setShowRoomData}/>;
      case 'tv':
        return <TheSeries setFilter={setFilter} setActiveTab={setActiveTab} setShowRoomData={setShowRoomData}/>;
      default:
        return (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#000"
                colors={['#000']}
              />
            }
          >
            <Banner movies={movies} loading={loading} setShowRoomData={setShowRoomData} setActiveTab={setActiveTab} />
            <LastWatchedRow setActiveTab={setActiveTab} setShowRoomData={setShowRoomData} />
            {randomRows.map((component) => component)}
          </ScrollView>
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <Header filter={filter} setFilter={setFilter} />
      {renderContent()}
    </SafeAreaView>
  );
}
