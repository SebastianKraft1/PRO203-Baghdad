/*
  Tab-navigasjonen for appen.
  Bruker expo-router for å lage tab-bar med 3 faner: Profil, Historikk og Instillinger.
*/

import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";

export default function TabBar() {
  return (
    <Tabs
      screenOptions={{
        title: "index",
        tabBarActiveTintColor: "#7B5FFF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "white" },
      }}
    >
      {/* Profil-fane */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={24} color={color} />
          ),
        }}
      />
      {/* Historikk-fane */}
      <Tabs.Screen
        name="history"
        options={{
          title: "Historikk",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="history" size={28} color={color} />
          ),
        }}
      />
      {/* Instillinger-fane */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Innstillinger",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Feather name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
