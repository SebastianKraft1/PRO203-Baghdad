import { listenToChildren } from "@/api/childrenApi";
import { auth } from "@/firebaseConfig";
import { Child } from "@/types/child";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type ChildWithTimes = Child & {
  checkInTime?: string;
  checkOutTime?: string;
};

//Henting av childId fra url /receipt-detail/[childId]
export default function ReceiptDetailPage() {
  const { childId } = useLocalSearchParams<{ childId: string }>();
  const userId = auth.currentUser?.uid; //Henter id til innlogget bruker

  const [child, setChild] = useState<ChildWithTimes | null>(null);

  //Henter/lytter på endringer i barnedata
  useEffect(() => {
    if (!userId || !childId) return;
    const unsubscribe = listenToChildren(userId, (children: any[]) => {
      const foundChild = children.find((child) => child.id === childId);
      setChild(foundChild ?? null);
    });

    return () => unsubscribe();
  }, [userId, childId]);

  //Funksjoner for å formatere tidspunktene til lettere lesbar tekst
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

 if (!child) { // Sjekk om barnet lastes inn og viser skjerm imens
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Kvittering" }} />
      <Text style={styles.pageTitle}>Laster data...</Text>
    </View>
  );
}

  const isCheckedIn = child.status?.toLowerCase().includes("inn"); //Sjekker om status innehoder "inn" for å skifte farge

  //Hoved rendring av siden
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Kvittering" }} />
      <Text style={styles.pageTitle}>Kvittering</Text>
      <View style={styles.card}>
        <View style={styles.childHeader}>
          <Text style={styles.childName}>{child.name}</Text>
          {!!child.department && (
            <Text style={styles.childDepartment}>{child.department}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Status nå:</Text>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusPill,
                isCheckedIn ? styles.statusIn : styles.statusOut,
              ]}
            >
              <Text style={styles.statusText}>{child.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Tidspunkt</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Siste innsjekk</Text>
            <Text style={styles.value}>{formatTime(child.checkInTime)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Siste utsjekk</Text>
            <Text style={styles.value}>{formatTime(child.checkOutTime)}</Text>
          </View>
        </View>
      </View>
       
       <Text style={styles.pageSubtitle}>
        Bekreftelse på nyeste inn-/ut-sjekk i barnehagen
      </Text>
    </View>
  );
}

//CSS for styling av kvitteringssiden
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F5F3FF",
  },
  center: {
    flex: 1,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#4B5563",
  },
  errorText: {
    fontSize: 16,
    color: "#B91C1C",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  pageSubtitle: {
    fontSize: 14,
    marginTop: 16,
    color: "#6B7280",
    marginBottom: 24,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  childHeader: {
    marginBottom: 12,
  },
  childName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  childDepartment: {
    fontSize: 14,
    color: "#6B21A8",
    marginTop: 2,
  },
  section: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  statusIn: {
    backgroundColor: "#DCFCE7",
  },
  statusOut: {
    backgroundColor: "#FEE2E2",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
  },
  value: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
    marginLeft: 12,
    textAlign: "right",
    flexShrink: 1,
  },
});