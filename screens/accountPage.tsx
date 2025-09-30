import { useEffect } from "react"
import { Text, View, BackHandler } from "react-native"



export default function AccountPage ({setActiveTab}:{setActiveTab: (tab: 'Home' | 'Search' | 'Live' | 'Show') => void;}) {

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
          <Text style={{color:'red',fontWeight:"bold",fontSize:25}}>Live events</Text>
                    <Text style={{ color: 'white',fontWeight:"bold" }}>will be there on the next update inchallah.</Text>
                  </View>
    )    
}