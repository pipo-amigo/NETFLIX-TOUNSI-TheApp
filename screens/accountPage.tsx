import { useEffect } from "react"
import { Text, View, BackHandler } from "react-native"



export default function AccountPage ({setActiveTab}:{setActiveTab: (tab: 'Home' | 'Search' | 'Account' | 'Show') => void;}) {

     useEffect(() => {
    const backAction = () => {
      setActiveTab("Home")
      return true; // block default behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
    return(
         <View className="flex-1 items-center justify-center bg-black">
                    <Text style={{ color: 'white' }}>Account Page</Text>
                  </View>
    )    
}