/*
  Root layout for appen som håndterer autentisering og navigasjon. 
  Viser loading state, sender uautentiserte brukere til innlogging,
  og setter opp hovednavigasjonen.
*/

import { Redirect, Stack } from "expo-router";
import "react-native-reanimated";

import { useAuthSession } from "@/providers/authctx";
import { Text, View } from "react-native";

export default function RootLayout() {
  const { user, isLoading } = useAuthSession();

  // Viser loading state mens vi venter på auth info
  if (isLoading) {
    return (
      <View>
        <Text>Henter bruker...</Text>
      </View>
    );
  }

  // Hvis brukeren ikke er logget inn, send til innlogging
  if (!user) {
    return <Redirect href={"/authentication"} />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="+not-found" />
      <Stack.Screen
        name="calendar"
        options={{ title: "Kalender", headerShown: false }}
      />
      <Stack.Screen
        name="privacy"
        options={{ title: "Personvern", headerShown: false }}
      />
    </Stack>
  );
}
