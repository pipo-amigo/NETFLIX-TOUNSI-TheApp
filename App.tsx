import React, { useState, useEffect } from 'react';
import { Text, View, Platform } from 'react-native';
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

  // Fetch shutdown state
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

    fetchShutdown();
    interval = setInterval(fetchShutdown, 5000);
    return () => clearInterval(interval);
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
        return <ShowRoom setActiveTab={setActiveTab} setDisableTabBar={setDisableTabBar} showRoomData={ShowRoomData} setShowRoomData={setShowRoomData} />;
      default:
        return null;
    }
  };

  // Render UpdateScreen if shutdown
  if (shutdown) return <UpdateScreen />;

  // If web and screen is big (e.g., width > 1024), show iframe
if (Platform.OS === 'web' && window.innerWidth > 1024) {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        backgroundColor: 'black',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        🚫 You can’t watch from your PC here
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        Please visit our website to continue:
      </p>
      <a
        href="https://net-flix-tounsi.netlify.app/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: '1.5rem',
          padding: '12px 24px',
          backgroundColor: '#e50914',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold',
        }}
      >
        Go to NETFLIX TOUNSI
      </a>
    </div>
  );
}

  // Otherwise, render normal React Native app
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        {renderContent()}
        {DisableTabBar && <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />}
        <StatusBar hidden={true} />
      </View>
    </SafeAreaProvider>
  );
}
