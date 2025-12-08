import { uploadImageToFirebase } from "@/api/imageApi";
import {
  getUserProfile,
  updateRegisteredChildren,
  updateUserProfileImage,
} from "@/api/userApi";
import SelectImageModal from "@/components/SelectImageModal";
import { auth } from "@/firebaseConfig";
import { UserData } from "@/types/user";
import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const userId = auth.currentUser?.uid;

  // Hent brukerdata
  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      const data = await getUserProfile(userId);
      if (data) setUser(data);
    };

    fetchUser();
  }, [userId]);

  // Håndter nytt bilde fra modal
  const handleNewImage = async (uri: string) => {
    if (!userId) return;

    const uploadResult = await uploadImageToFirebase(uri);
    if (uploadResult) {
      await updateUserProfileImage(userId, uploadResult.url, uploadResult.path);
      setUser((prev) =>
        prev ? { ...prev, profileImage: uploadResult.url } : prev
      );
    }
  };

  // Legg til et registrert barn
  const handleAddChild = async () => {
    if (!userId || !user) return;

    const newCount = (user.registeredChildren ?? 0) + 1;
    await updateRegisteredChildren(userId, newCount);
    setUser({ ...user, registeredChildren: newCount });
  };

  if (!user) return <Text style={styles.loadingText}>Loading...</Text>;

  return (
    <View style={styles.container}>
      {/* Profilbilde */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image
          source={
            user.profileImage
              ? { uri: user.profileImage }
              : require("../../../assets/images/placeholder-profile.png")
          }
          style={styles.profileImage}
        />
      </TouchableOpacity>

      {/* Navn og rolle */}
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.role}>{user.role}</Text>

      {/* Registered children */}
      <View style={styles.childrenContainer}>
        <Text style={styles.childrenText}>
          Registrerte barn: {user.registeredChildren ?? 0}
        </Text>
        <Button title="Registrer +" onPress={handleAddChild} />
      </View>

      {/* Modal for bildevalg */}
      {modalVisible && (
        <SelectImageModal
          closeModal={() => setModalVisible(false)}
          setImage={handleNewImage}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ccc",
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "600",
  },
  role: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  childrenContainer: {
    alignItems: "center",
  },
  childrenText: {
    fontSize: 18,
    marginBottom: 8,
  },
});
