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

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});
export default function App() {



  const [activeTab, setActiveTab] = useState<'Home' | 'Search' | 'Account' | 'Show'>('Home');
  const [ShowRoomData, setShowRoomData] = useState<any>(null);
  const [DisableTabBar, setDisableTabBar] = useState(true);
   const [shutdown, setShutdown] = useState(true);
  //   useEffect(() => {
  //   fetch("http://20.199.66.194:5000/api/shutdown/1756150755441")
  //     .then(res => res.json())
  //     .then(data => {
  //       // console.log("Shutdown state:", data.shutdown);
  //       setShutdown(data.shutdown);
  //     })
  //     .catch(err => console.error("Failed to fetch shutdown state:", err));
  // }, []);
useEffect(() => {
  fetch("http://20.199.66.194:5000/api/shutdown/1756150755441", {
        headers: {
          Accept: "application/json",
        },
      })
    .then(async res => {
      const text = await res.text();
      console.log("Raw response:", text);

      try {
        const data = JSON.parse(text);
        setShutdown(data.shutdown);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        setShutdown(false); // fallback
      }
    })
    .catch(err => console.error("Fetch error:", err));
}, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <HomePage setActiveTab={setActiveTab} setShowRoomData={setShowRoomData}/>;
      case 'Search':
        return <SearchPage setShowRoomData={setShowRoomData} setActiveTab={setActiveTab}/>
      case 'Account':
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
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      {renderContent()}
      {DisableTabBar&&<TabBar activeTab={activeTab} setActiveTab={setActiveTab} />}
      <StatusBar hidden={true} />
    </View>
  );
}
