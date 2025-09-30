import React, { useState ,useEffect} from 'react';
import { Text, View ,TouchableOpacity, Linking} from 'react-native';
import HomePage from './screens/homeScreen';
import TabBar from './components/TabBar';
import SearchPage from './screens/searchPage';
import { StatusBar } from 'expo-status-bar';
import ShowRoom from './screens/showRoom';
import 'react-native-gesture-handler';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import AccountPage from 'screens/accountPage';
import UpdateScreen from 'screens/updateScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});
export default function App() {



  const [activeTab, setActiveTab] = useState<'Home' | 'Search' | 'Live' | 'Show'>('Home');
  const [ShowRoomData, setShowRoomData] = useState<any>(null);
  const [DisableTabBar, setDisableTabBar] = useState(true);
   const [shutdown, setShutdown] = useState(false);
   useEffect(() => {
  let interval: NodeJS.Timeout;

  const fetchShutdown = async () => {
    try {
      const res = await fetch("https://expects-like-required-labour.trycloudflare.com/api/shutdown/1756150755441");
      const data = await res.json();
      setShutdown(data.shutdown);
    } catch (err) {
      console.log("Failed to fetch shutdown state:", err);
    }
  };

  // fetch once immediately
  fetchShutdown();

  // then fetch every 5 seconds (adjust interval if needed)
  interval = setInterval(fetchShutdown, 5000);

  // cleanup when component unmounts
  return () => clearInterval(interval);
}, []);
// useEffect(() => {
//   fetch("http://20.199.66.194:5000/api/shutdown/1756150755441", {
//         headers: {
//           Accept: "application/json",
//         },
//       })
//     .then(async res => {
//       const text = await res.text();
//       console.log("Raw response:", text);

//       try {
//         const data = JSON.parse(text);
//         setShutdown(data.shutdown);
//       } catch (e) {
//         console.error("Failed to parse JSON:", e);
//         setShutdown(false); // fallback
//       }
//     })
//     .catch(err => console.error("Fetch error:", err));
// }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <HomePage setActiveTab={setActiveTab} setShowRoomData={setShowRoomData}/>;
      case 'Search':
        return <SearchPage setShowRoomData={setShowRoomData} setActiveTab={setActiveTab}/>
      case 'Live':
        return (
         <AccountPage setActiveTab={setActiveTab}/>
        );
      case 'Show':
        return <ShowRoom  setActiveTab={setActiveTab} setDisableTabBar={setDisableTabBar} showRoomData={ShowRoomData} setShowRoomData={setShowRoomData}/>;
      default:
        return null;
    }
  };
 if (shutdown) {
    return (
    <UpdateScreen/>
    );
  }
  return (
     <SafeAreaProvider>
    <View style={{ flex: 1, backgroundColor: 'black' }} >
      {renderContent()}
      {DisableTabBar&&<TabBar activeTab={activeTab} setActiveTab={setActiveTab} />}
      <StatusBar hidden={true} />
    </View>
    </SafeAreaProvider>
  );
}
