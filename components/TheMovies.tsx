import React, { useEffect, useState } from 'react';
import { ScrollView ,BackHandler} from 'react-native';
import TVxMovie from './TVxMovie';
import { options } from '../utils/options';
import LogoLoader from './logoLoader';

export default function TheMovies({
  setFilter,
  setActiveTab,
  setShowRoomData,
}: {
  setFilter:(filer:'movies' | 'tv' | null)=>void;
  setActiveTab: (tab: 'Home' | 'Search' | 'Account' | 'Show') => void;
  setShowRoomData?: (data: any) => void;
}) {
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.themoviedb.org/3/genre/movie/list?language=en-US', options)
      .then((res) => res.json())
      .then((data) => setGenres(data.genres || []))
      .catch((err) => console.error('Error fetching movie genres:', err))
      .finally(() => setLoading(false));
  }, []);
   useEffect(() => {
      const backAction = () => {
        setFilter(null)
        return true; // block default behavior
      };
  
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
  
      return () => backHandler.remove();
    }, []);

  if (loading) {
    return (
        <LogoLoader messages={"Loading Movies..."}/>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="bg-black pb-10">
      {genres.map((genre) => (
        <TVxMovie
          setActiveTab={setActiveTab}
          setShowRoomData={setShowRoomData}
          key={genre.id}
          url={`https://api.themoviedb.org/3/discover/movie?with_genres=${genre.id}&language=en-US&page=1`}
          title={genre.name}
          type="movie"
        />
      ))}
    </ScrollView>
  );
}
