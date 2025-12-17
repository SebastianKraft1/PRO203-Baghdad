/* 
  Side for å vise historikk over barns innsjekk / utsjekk.
  Henter data fra Firestore via listenToChildren, sorterer dem kronologisk
  og viser en liste.
*/

import { listenToChildren } from "@/api/childrenApi";
import { Colors } from "@/constants/theme";
import { auth } from "@/firebaseConfig";
import { Child } from "@/types/child";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

// Type for historikk-logg
type HistoryLog = {
  type: string;
  name: string;
  time: Date;
};

export default function HistoryPage() {
  const [activities, setActivities] = useState<HistoryLog[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const userId = auth.currentUser?.uid;

  // Lytter til data i sanntid
  useEffect(() => {
    if (!userId) return;

    const stopListening = listenToChildren(userId, (children: Child[]) => {
      const logs: HistoryLog[] = [];

      children.forEach((child) => {
        // Legger til Alle innsjekk
        if (child.checkInHistory && child.checkInHistory.length > 0) {
          child.checkInHistory.forEach((checkInTime) => {
            logs.push({
              type: "Innsjekket",
              name: child.name,
              time: new Date(checkInTime),
            });
          });
        } else if (child.checkInTime) {
          logs.push({
            type: "Innsjekket",
            name: child.name,
            time: new Date(child.checkInTime),
          });
        }
        // Legger til alle utsjekk
        if (child.checkOutHistory && child.checkOutHistory.length > 0) {
          child.checkOutHistory.forEach((checkOutTime) => {
            logs.push({
              type: "Hentet",
              name: child.name,
              time: new Date(checkOutTime),
            });
          });
        } else if (child.checkOutTime) {
          logs.push({
            type: "Hentet",
            name: child.name,
            time: new Date(child.checkOutTime),
          });
        }
      });
      // Sorter loggene etter tid, nyeste først
      logs.sort((a, b) => b.time.getTime() - a.time.getTime());
      setActivities(logs);
      setVisibleCount(6);
    });
    return () => stopListening();
  }, [userId]);

  const visibleActivities = activities.slice(0, visibleCount);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Historikk</Text>
      <ScrollView contentContainerStyle={styles.activityList}>
        {visibleActivities.map((item, index) => (
          <View key={index} style={styles.activityItem}>
            <View style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                {/* Dato og klokkeslett */}
                <View style={styles.dateRow}>
                  <Text style={styles.date}>
                    {item.time.toLocaleDateString("nb-NO", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </Text>
                  <Text style={styles.time}>
                    {item.time.toLocaleTimeString("nb-NO", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
                {/* Tskstbeskrivelse */}
                <Text style={styles.activityText}>
                  {item.type === "Innsjekket"
                    ? `${item.name} ble sjekket inn.`
                    : `${item.name} ble hentet.`}
                </Text>
              </View>
              {/* Ikon som viser type */}
              <View style={styles.iconContainer}>
                {item.type === "Innsjekket" ? (
                  <FontAwesome6
                    name="house-circle-check"
                    size={26}
                    color={Colors.light.accent}
                  />
                ) : (
                  <FontAwesome5
                    name="car-side"
                    size={26}
                    color={Colors.light.accent}
                  />
                )}
              </View>
            </View>
            <View style={styles.divider} />
          </View>
        ))}

        {/* Knapp for å vise flere elementer */}
        {activities.length > visibleCount && (
          <Pressable
            style={styles.showMoreButton}
            onPress={() => setVisibleCount((prev) => prev + 6)}
          >
            <Text style={styles.showMoreText}>Vis mer</Text>
          </Pressable>
        )}
        {/* Melding hvis det ikke her vært noe aktivitet */}
        {activities.length === 0 && (
          <Text style={styles.noActivityText}>
            Ingen aktiviteter å vise. Sjekk inn eller hent barnet ditt for å se
            aktivitet her.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 6,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 40,
    marginBottom: 12,
    paddingHorizontal: 14,
    color: Colors.light.text,
  },
  activityList: {
    paddingBottom: 60,
  },
  activityItem: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 14,
    marginBottom: 8,
  },
  date: {
    backgroundColor: Colors.light.surfaceSoft,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 14,
    fontSize: 18,
  },
  time: {
    backgroundColor: Colors.light.surfaceSoft,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 14,
    fontSize: 18,
  },
  activityText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginTop: 10,
  },
  noActivityText: {
    textAlign: "center",
    marginTop: 24,
    color: Colors.light.mutedText,
  },
  showMoreButton: {
    alignSelf: "center",
    padding: 10,
  },
  showMoreText: {
    color: Colors.light.primary,
    fontSize: 16,
  },
});
