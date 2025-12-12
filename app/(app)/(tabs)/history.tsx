import { listenToChildren } from '@/api/childrenApi';
import { auth } from '@/firebaseConfig';
import { Child } from '@/types/child';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// Fiks type til types mappen
type HistoryLog = {
  type: string;
  name: string;
  time: Date;
};

export default function HistoryPage() {
  const [activities, setActivities] = useState<HistoryLog[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;

    const stopListening = listenToChildren(userId, (children: Child[]) => {
      const logs: HistoryLog[] = [];

      children.forEach((child) => {
        // Alle innsjekk
        if(child.checkInHistory && child.checkInHistory.length > 0) {
          child.checkInHistory.forEach((checkInTime) => {
            logs.push({
              type: "Innsjekket",
              name: child.name,
              time: new Date(checkInTime),
            });
          });
        } else if(child.checkInTime) {
          logs.push({
            type: "Innsjekket",
            name: child.name,
            time: new Date(child.checkInTime),
          });
        }

        if(child.checkOutHistory && child.checkOutHistory.length > 0) {
          child.checkOutHistory.forEach((checkOutTime) => {
            logs.push({
              type: "Hentet",
              name: child.name,
              time: new Date(checkOutTime),
            });
          });
        } else if(child.checkOutTime) {
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
      <Text style={styles.header}>Historikk</Text>

      <ScrollView contentContainerStyle={styles.activityList}>
        {visibleActivities.map((item, index) => (
          <View key={index} style={styles.activityItem}>
            <View style={styles.itemRow}>
              <View style={{ flex: 1 }}>
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
                <Text style={styles.activityText}>
                    {item.type === "Innsjekket"
                      ? `${item.name} ble sjekket inn.`
                      : `${item.name} ble hentet.`}
                </Text>
              </View>
              <View style={styles.iconContainer}>
                {item.type === "Innsjekket" ? (
                  <FontAwesome6 name="house-circle-check" size={26} color="#5019cfa0" />
                ) : (
                  <FontAwesome5 name="car-side" size={26} color="#5019cfa0" />
                )}
              </View>
            </View>
            <View style={styles.divider} />
          </View>
        ))}

        {activities.length > visibleCount && (
          <Pressable 
            style={styles.showMoreButton}
            onPress={() => setVisibleCount((prev) => prev + 6)}
          >
            <Text style={styles.showMoreText}>Vis mer</Text>
          </Pressable>
        )}

        {activities.length === 0 && (
          <Text style={styles.noActivityText}>
            Ingen aktiviteter å vise. Sjekk inn eller hent barnet ditt for å se aktivitet her.
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
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 40,
    marginBottom: 12,
    paddingHorizontal: 12,
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
    backgroundColor: "#e9e8e8ff",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 14,
    fontSize: 18,
  },
  time: {
    backgroundColor: "#e9e8e8ff",
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
    backgroundColor: "#d6d3d3ff",
    marginTop: 10,
  },
  noActivityText: {
    textAlign: "center",
    marginTop: 24,
    color: "#6B7280",
  },
  showMoreButton: {
    alignSelf: "center",
    padding: 10,
  },
  showMoreText: {
    color: "#6c97feff",
    fontSize: 16,
  },
});
