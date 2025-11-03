import React, { useState, useEffect } from 'react';
import { Text, View, Platform } from 'react-native';
import HomePage from './screens/homeScreen';
import TabBar from './components/TabBar';
import SearchPage from './screens/searchPage';
import { StatusBar } from 'expo-status-bar';
import ShowRoom from './screens/showRoom';
import 'react-native-gesture-handler';
import { Helmet } from "react-helmet";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import AccountPage from 'screens/accountPage';
import UpdateScreen from 'screens/updateScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AdModal from 'components/AdModal';

// Configure Reanimated logger
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function App() {
  const [activeTab, setActiveTab] = useState<'Home' | 'Search' | 'Live' | 'Show'>('Home');
  const [ShowRoomData, setShowRoomData] = useState<any>(null);
  const [DisableTabBar, setDisableTabBar] = useState(true);
  const [shutdown, setShutdown] = useState(false);
  const [showAds, setShowAds] = useState(true);
  const [IsMobileView, setIsMobileView] = useState(true);

  // ✅ Detect screen size on web
  useEffect(() => {
    if (Platform.OS === 'web') {
      const checkScreenSize = () => {
        const isMobile = window.innerWidth < 1024;
        setIsMobileView(isMobile);

        // ✅ redirect if it's desktop (not mobile)
        if (!isMobile) {
          window.location.replace('https://net-flix-tounsi.netlify.app/');
        }
      };

      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);
      return () => window.removeEventListener('resize', checkScreenSize);
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <HomePage setActiveTab={setActiveTab} setShowRoomData={setShowRoomData} />;
      case 'Search':
        return <SearchPage setShowRoomData={setShowRoomData} setActiveTab={setActiveTab} />;
      case 'Live':
        return <AccountPage setActiveTab={setActiveTab} />;
      case 'Show':
        return (
          <ShowRoom
            setActiveTab={setActiveTab}
            setDisableTabBar={setDisableTabBar}
            showRoomData={ShowRoomData}
            setShowRoomData={setShowRoomData}
          />
        );
      default:
        return null;
    }
  };

  if (shutdown) return <UpdateScreen />;

  // ✅ While it's detecting or about to redirect, render nothing
  if (Platform.OS === 'web' && !IsMobileView) {
    return null;
  }

  // ✅ Normal mobile web + native render
  return (<>
   <Helmet>
        <meta name="ppck-ver" content="2184dce966df5971c65b1d789b430f0b" />
      </Helmet>
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        {renderContent()}
        {DisableTabBar && <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />}
        <StatusBar hidden={true} />
        <AdModal
          visible={false} // showAds}
          onClose={() => setShowAds(false)}
          apiUrl="http://localhost:5000/api/ads"
        />
      </View>
    </SafeAreaProvider>
    </>
  );
}
