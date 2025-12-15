/*
    Startside som automatisk videresender brukeren til profilen.
*/

import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/profile" />;
}
