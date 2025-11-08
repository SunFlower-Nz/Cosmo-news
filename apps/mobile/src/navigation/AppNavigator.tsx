import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import { enableScreens } from "react-native-screens";

// TEMP: disable native screens optimizations due to Android string→boolean crash
// Revisit after upgrading Expo/RN libs.
enableScreens(false);

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#67e8f9",
          tabBarInactiveTintColor: "rgba(255, 255, 255, 0.5)",
          tabBarShowLabel: true,
          tabBarLabelStyle: { 
            fontSize: 10, 
            fontWeight: "700",
            marginTop: 2,
            marginBottom: 8,
            letterSpacing: 0.5,
          },
          tabBarStyle: {
            position: 'absolute',
            bottom: 20,
            marginHorizontal: 24,
            backgroundColor: 'rgba(12, 15, 31, 0.95)',
            borderRadius: 24,
            borderTopWidth: 0,
            borderWidth: 1.5,
            borderColor: 'rgba(103, 232, 249, 0.25)',
            height: 68,
            paddingBottom: 10,
            paddingTop: 10,
            shadowColor: "#67e8f9",
            shadowOffset: { width: 0, height: 15 },
            shadowOpacity: 0.35,
            shadowRadius: 30,
            elevation: 20,
          },
          tabBarItemStyle: {
            paddingVertical: 2,
          },
          tabBarIcon: ({ color, focused }) => {
            let iconName: keyof typeof Ionicons.glyphMap = "home";
            
            if (route.name === "Inicio") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Buscar") {
              iconName = focused ? "search" : "search-outline";
            } else if (route.name === "Favoritos") {
              iconName = focused ? "heart" : "heart-outline";
            } else if (route.name === "Perfil") {
              iconName = focused ? "person" : "person-outline";
            }

            return <Ionicons name={iconName} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Inicio" component={HomeScreen} />
        <Tab.Screen name="Buscar" component={SearchScreen} />
        <Tab.Screen name="Favoritos" component={FavoritesScreen} />
        <Tab.Screen name="Perfil" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}