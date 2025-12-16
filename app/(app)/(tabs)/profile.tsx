/*
  Profilside for brukeren. Viser profilbilde, navn, rolle, statistikk og liste over barn.
  Lar brukeren sjekke inn/ut barn, oppdatere profilbilde, og registrere nye barn via modal.
*/

import {
  checkInChild,
  checkOutChild,
  listenToChildren,
} from "@/api/childrenApi";
import { uploadImageToFirebase } from "@/api/imageApi";
import { getUserProfile, updateUserProfileImage } from "@/api/userApi";
import RegisterChildModal from "@/components/RegisterChildModal";
import SelectImageModal from "@/components/SelectImageModal";
import { Colors } from "@/constants/theme";
import { auth } from "@/firebaseConfig";
import { Child } from "@/types/child";
import { UserData } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isChildModalVisible, setIsChildModalVisible] = useState(false);
  const userId = auth.currentUser?.uid;

  // Hent brukerprofil ved oppstart
  useEffect(() => {
    if (!userId) return;
    getUserProfile(userId).then((data) => {
      if (data) setUser(data);
    });
  }, [userId]);

  // Lytter til data fra Firestore i sanntid
  useEffect(() => {
    if (!userId) return;
    const unsubscribe = listenToChildren(userId, (childrenData: any[]) => {
      setChildren(childrenData);
    });
    return () => unsubscribe();
  }, [userId]);

  // Håndterer valgt bilde fra modalen
  const handleImageSelected = async (imageUri: string) => {
    if (!userId || !user) return;
    const uploadedImage = await uploadImageToFirebase(imageUri);
    if (!uploadedImage) return;

    const { url: downloadUrl, path: imagePath } = uploadedImage;
    await updateUserProfileImage(userId, downloadUrl, imagePath);
    setUser({
      ...user,
      profileImage: downloadUrl,
      profileImagePath: imagePath,
    });
  };

  const checkedInCount = children.filter((c) => c.isCheckedIn).length;

  // Loading state hvis brukerdata ikke er lastet
  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Laster...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Kalenderknapp */}
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.push("../calendar")}>
            <FontAwesome name="calendar" size={30} color={Colors.light.primaryDark} />
          </Pressable>
        </View>
        {/* Header med profilbilde */}
        <View style={styles.header}>
          <Pressable
            onPress={() => setIsImageModalVisible(true)}
            style={styles.profileImageContainer}
          >
            <Image
              source={
                user.profileImage
                  ? { uri: user.profileImage }
                  : require("../../../assets/images/placeholder-profile.png")
              }
              style={styles.profileImage}
            />
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={18} color="#fff" />
            </View>
          </Pressable>

          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>{user.role}</Text>
        </View>

        {/* Statistikk */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.activeCard]}>
            <Text style={styles.statNumber}>{checkedInCount}</Text>
            <Text style={styles.statLabel}>Innsjekket</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumberGray}>
              {children.length - checkedInCount}
            </Text>
            <Text style={styles.statLabelGray}>Hjemme</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumberGray}>{children.length}</Text>
            <Text style={styles.statLabelGray}>Totalt</Text>
          </View>
        </View>

        {/* Liste over barn */}
        <View style={styles.childrenSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mine barn</Text>
            <TouchableOpacity onPress={() => setIsChildModalVisible(true)}>
              <Ionicons name="add-circle" size={28} color="#A569BD" />
            </TouchableOpacity>
          </View>

          {children.map((child) => (
            <View key={child.id} style={styles.childCard}>
              <View style={styles.childInfo}>
                {/* Avatar og detaljer */}
                <View style={styles.childAvatar}>
                  <Text style={styles.avatarText}>
                    {child.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.childDetails}>
                  <Text style={styles.childName}>{child.name}</Text>
                  <Text style={styles.childMeta}>
                    {child.age} år • {child.department}
                  </Text>
                  {child.allergies && (
                    <View style={styles.allergyBadge}>
                      <Ionicons name="alert-circle" size={12} color="#E74C3C" />
                      <Text style={styles.allergyText}>{child.allergies}</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Innsjekk / Utsjekk knapp */}
              <TouchableOpacity
                style={[
                  styles.checkButton,
                  child.isCheckedIn ? styles.checkOut : styles.checkIn,
                ]}
                onPress={() =>
                  child.isCheckedIn
                    ? checkOutChild(userId!, child.id)
                    : checkInChild(userId!, child.id)
                }
              >
                <Ionicons
                  name={
                    child.isCheckedIn ? "log-out-outline" : "log-in-outline"
                  }
                  size={18}
                  color="#fff"
                />
                <Text style={styles.buttonText}>
                  {child.isCheckedIn ? "Sjekk ut" : "Sjekk inn"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal for profilbilde */}
      <Modal visible={isImageModalVisible} animationType="slide">
        <SelectImageModal
          closeModal={() => setIsImageModalVisible(false)}
          setImage={handleImageSelected}
        />
      </Modal>

      {/* Modal for registrering av barn */}
      {userId && (
        <RegisterChildModal
          isVisible={isChildModalVisible}
          setIsVisible={setIsChildModalVisible}
          userId={userId}
          confirmChildAdded={() => {}}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 18,
    paddingTop: 65,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.surfaceSoft,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.light.accent,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.light.background,
  },
  name: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: Colors.light.mutedText,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.card,
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  activeCard: {
    backgroundColor: Colors.light.accent,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  statNumberGray: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  statLabel: {
    fontSize: 12,
    color: "#fff",
    marginTop: 4,
  },
  statLabelGray: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  childrenSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  childCard: {
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  childInfo: {
    flexDirection: "row",
    marginBottom: 12,
  },
  childAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.surfaceSoft,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.accent,
  },
  childDetails: {
    flex: 1,
    justifyContent: "center",
  },
  childName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  childMeta: {
    fontSize: 14,
    color: "#666",
  },
  allergyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE8E8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  allergyText: {
    fontSize: 11,
    color: "#E74C3C",
    marginLeft: 4,
    fontWeight: "500",
  },
  checkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  checkIn: {
    backgroundColor: "#4CAF50",
  },
  checkOut: {
    backgroundColor: "#FF9800",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
