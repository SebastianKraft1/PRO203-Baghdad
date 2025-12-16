/*
    Hovedlayout for appen.
    Pakker inn alle sider med AuthSessionProvider for å go tilgang
    til autentiserings-konteksten.
*/

import { AuthSessionProvider } from "@/providers/authctx";
import { ThemeProvider } from "@/providers/themectx";
import { Slot } from "expo-router";

export default function RootRootLayout() {
  return (
    <AuthSessionProvider>
      <ThemeProvider>
        <Slot />
      </ThemeProvider>
    </AuthSessionProvider>
  );
}
