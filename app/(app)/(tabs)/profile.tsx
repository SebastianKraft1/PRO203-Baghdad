import {
  checkInChild,
  checkOutChild,
  listenToChildren,
} from "@/api/childrenApi";
import { uploadImageToFirebase } from "@/api/imageApi";
import { getUserProfile, updateUserProfileImage } from "@/api/userApi";
import RegisterChildModal from "@/components/RegisterChildModal"; // <-- Importer her
import SelectImageModal from "@/components/SelectImageModal";
import { auth } from "@/firebaseConfig";
import { Child } from "@/types/child";
import { UserData } from "@/types/user";
import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isChildModalVisible, setIsChildModalVisible] = useState(false); // <-- Ny state
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

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = listenToChildren(userId, (childrenData: any[]) => {
      setChildren(childrenData);
      setUser((prev) =>
        prev ? { ...prev, registeredChildren: childrenData.length } : prev
      );
    });

    return () => unsubscribe();
  }, [userId]);

  // Callback når et barn er lagt til
  const handleChildAdded = () => {
    // Refresh brukerdata for å få oppdatert children count
    if (!userId) return;

    getUserProfile(userId).then((data) => {
      if (data) setUser(data);
    });
  };

  // Håndter bildevalg fra modal
  const handleImageSelected = async (imageUri: string) => {
    if (!userId || !user) return;

    const uploadedImage = await uploadImageToFirebase(imageUri);
    if (!uploadedImage) {
      console.error("Error while uploading image");
      return;
    }

    const { url: downloadUrl, path: imagePath } = uploadedImage;
    await updateUserProfileImage(userId, downloadUrl, imagePath);

    setUser({
      ...user,
      profileImage: downloadUrl,
      profileImagePath: imagePath,
    });
  };

  if (!user) return <Text style={styles.loadingText}>Loading...</Text>;

  return (
    <View style={styles.container}>
      {/* Profilbilde */}
      <Pressable
        onPress={() => setIsImageModalVisible(true)}
        style={{ alignItems: "center" }}
      >
        <Image
          source={
            user.profileImage
              ? { uri: user.profileImage }
              : require("../../../assets/images/placeholder-profile.png")
          }
          style={styles.profileImage}
        />
        <Text style={styles.editImgText}>Rediger bilde</Text>
      </Pressable>

      {/* Navn og rolle */}
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.role}>{user.role}</Text>

      <View style={styles.childrenSection}>
        <View style={styles.childrenHeader}>
          <Text style={styles.sectionTitle}>Registrerte barn</Text>
          <Button
            title="Registrer barn +"
            onPress={() => setIsChildModalVisible(true)}
          />
        </View>

        {children.map((child) => (
          <View key={child.id} style={styles.childCard}>
            <View style={styles.childInfo}>
              <Text style={styles.childName}>{child.name}</Text>
              <Text>Alder: {child.age}</Text>
              <Text>Avdeling: {child.department}</Text>
              {child.allergies && <Text>Allergier: {child.allergies}</Text>}
              <Text
                style={[
                  styles.childStatus,
                  child.isCheckedIn ? styles.checkedIn : styles.checkedOut,
                ]}
              >
                {child.status}
              </Text>
            </View>
            <Button
              title={child.isCheckedIn ? "Sjekk ut" : "Sjekk inn"}
              onPress={() => {
                if (child.isCheckedIn) {
                  checkOutChild(userId!, child.id);
                } else {
                  checkInChild(userId!, child.id);
                }
              }}
            />
          </View>
        ))}
      </View>

      {/* Modal for å velge bilde */}
      <Modal visible={isImageModalVisible} animationType="slide">
        <SelectImageModal
          closeModal={() => setIsImageModalVisible(false)}
          setImage={handleImageSelected}
        />
      </Modal>

      {/* Modal for å registrere barn */}
      {userId && (
        <RegisterChildModal
          isVisible={isChildModalVisible}
          setIsVisible={setIsChildModalVisible}
          userId={userId}
          confirmChildAdded={handleChildAdded}
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
    marginBottom: 8,
  },
  editImgText: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 12,
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
  childrenSection: {
    width: "90%",
    backgroundColor: "#EDE6FF",
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  childrenHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#5B2C6F",
  },
  childCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  childInfo: {
    flex: 1,
    marginRight: 12,
  },
  childName: {
    fontSize: 18,
    fontWeight: "600",
  },
  childStatus: {
    marginTop: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    color: "#fff",
    fontWeight: "500",
    alignSelf: "flex-start",
  },
  checkedIn: {
    backgroundColor: "#A569BD",
  },
  checkedOut: {
    backgroundColor: "#A569BD",
  },
});
