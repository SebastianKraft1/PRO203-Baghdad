/*
    Hovedlayout for appen.
    Pakker inn alle sider med AuthSessionProvider for å go tilgang
    til autentiserings-konteksten.
*/

import { AuthSessionProvider } from "@/providers/authctx";
import { Slot } from "expo-router";

export default function RootRootLayout() {
  return (
    <AuthSessionProvider>
      <Slot />
    </AuthSessionProvider>
  );
}
