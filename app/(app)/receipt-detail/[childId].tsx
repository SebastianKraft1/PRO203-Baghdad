import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { auth } from "@/firebaseConfig";
import { listenToChildren } from "@/api/childrenApi";
import { Child } from "@/types/child";

type ChildWithTimes = Child & {
  checkInTime?: string;
  checkOutTime?: string;
};

export default function ReceiptDetailPage() {
  const { childId } = useLocalSearchParams<{ childId: string }>();
  const userId = auth.currentUser?.uid;

  const [child, setChild] = useState<ChildWithTimes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !childId) return;

    const unsubscribe = listenToChildren(userId, (children: any[]) => {
      const foundChild = children.find((child) => child.id === childId);
      setChild(foundChild ?? null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, childId]);

  const formatTime = (isoString?: string) => {
    if (!isoString) return "Ikke registrert";

    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Ugyldig tidspunkt";

    return date.toLocaleString("nb-NO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Laster kvittering...</Text>
      </View>
    );
  }

  if (!child) {
    return (
      <View style={styles.center}>
        <Text>Fant ikke barnet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Kvittering" }} />

      <Text style={styles.title}>Kvittering for inn-/ut-sjekk</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Barn</Text>
        <Text style={styles.value}>{child.name}</Text>

        <Text style={styles.label}>Status nå</Text>
        <Text style={styles.value}>{child.status}</Text>

        <Text style={styles.label}>Siste innsjekk</Text>
        <Text style={styles.value}>{formatTime(child.checkInTime)}</Text>

        <Text style={styles.label}>Siste utsjekk</Text>
        <Text style={styles.value}>{formatTime(child.checkOutTime)}</Text>
      </View>

      <Text style={styles.footer}>
        Denne kvitteringen viser siste registrerte inn-/ut-sjekking for barnet.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 24,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#EDE6FF",
    gap: 12,
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  footer: {
    marginTop: 16,
    fontSize: 12,
    color: "#6B7280",
  },
});