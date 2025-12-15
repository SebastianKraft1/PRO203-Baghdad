/*
  Viser app-innstillinger som språk, mørk modus, kontohåndtering,
  samt navigasjon til Personvern/GDPR og redigering av brukerprofil.
*/

import * as authApi from "@/api/authApi";
import EditProfileModal from "@/components/EditProfileModal";
import { useAuthSession } from "@/providers/authctx";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function SettingsPage() {
  const { signOut } = useAuthSession();

  const [language, setLanguage] = useState<"no" | "en">("no");
  const [darkMode, setDarkMode] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);

  // Sletter brukerens konto permanent
  const handleDeleteAccount = async () => {
    Alert.alert(
      "Slett konto",
      "Er du sikker på at du vil slette kontoen din? Dette kan ikke angres.",
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: "Slett",
          style: "destructive",
          onPress: async () => {
            await authApi.deleteAccount();
            await signOut();
          },
        },
      ]
    );
  };

  // Endrer passord (kun støttet på iOS)
  const handleChangePassword = async () => {
    if (Platform.OS === "ios") {
      Alert.prompt(
        "Endre passord",
        "Skriv inn nytt passord:",
        async (newPassword) => {
          if (!newPassword) return;
          await authApi.changePassword(newPassword);
          Alert.alert("Suksess", "Passordet ditt har blitt endret.");
        },
        "secure-text"
      );
    } else {
      Alert.alert("Android", "Passordendring på Android støttes ikke ennå.");
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleLanguageChange = () => {
    setLanguage((prev) => (prev === "no" ? "en" : "no"));
  };

  const currentLanguageLabel = language === "no" ? "Norsk" : "English";
  const currentLanguageFlag = language === "no" ? "🇳🇴" : "🇬🇧";

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require("../../../assets/images/safedrop-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Innstillinger</Text>
          <Pressable
            onPress={handleLanguageChange}
            style={styles.languageButton}
          >
            <Text style={styles.languageFlag}>{currentLanguageFlag}</Text>
            <Text style={styles.languageLabel}>{currentLanguageLabel}</Text>
          </Pressable>
        </View>

        <Text style={styles.subtitle}>Her kan du endre på profilen din</Text>

        {/* Dark mode toggle */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Lys modus / Mørk modus</Text>
          <Pressable
            onPress={() => setDarkMode((prev) => !prev)}
            style={[
              styles.toggleButton,
              darkMode ? styles.toggleOn : styles.toggleOff,
            ]}
          >
            <View
              style={[
                styles.toggleCircle,
                darkMode ? styles.circleOn : styles.circleOff,
              ]}
            />
          </Pressable>
        </View>

        {/* Handlinger */}
        <View style={styles.buttonsContainer}>
          <Pressable
            style={styles.settingButton}
            onPress={() => router.push("/(app)/privacy")}
          >
            <Text style={styles.settingButtonText}>Personvern / GDPR</Text>
          </Pressable>

          <Pressable
            style={styles.settingButton}
            onPress={() => setIsEditVisible(true)}
          >
            <Text style={styles.settingButtonText}>Rediger konto</Text>
          </Pressable>

          <Pressable
            style={styles.settingButton}
            onPress={handleChangePassword}
          >
            <Text style={styles.settingButtonText}>Endre passord</Text>
          </Pressable>

          <Pressable
            style={[styles.settingButton, styles.dangerButton]}
            onPress={handleDeleteAccount}
          >
            <Text style={[styles.settingButtonText, styles.dangerText]}>
              Slett konto
            </Text>
          </Pressable>

          <Pressable style={styles.settingButton} onPress={handleSignOut}>
            <Text style={styles.settingButtonText}>Logg ut</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Rediger profil-modal */}
      <Modal
        visible={isEditVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable
              style={styles.closeIcon}
              onPress={() => setIsEditVisible(false)}
            >
              <AntDesign name="close" size={20} color="#111827" />
            </Pressable>
            <EditProfileModal onClose={() => setIsEditVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: "center",
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 16,
    marginTop: 40,
  },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#E3E4E8",
  },
  languageFlag: {
    fontSize: 16,
    marginRight: 6,
  },
  languageLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  subtitle: {
    width: "100%",
    fontSize: 14,
    marginBottom: 24,
  },
  toggleRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#E3E4E8",
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  toggleButton: {
    width: 48,
    height: 26,
    borderRadius: 20,
    padding: 3,
    justifyContent: "center",
  },
  toggleOn: {
    backgroundColor: "#6d61bcff",
  },
  toggleOff: {
    backgroundColor: "#a1a1a1",
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  circleOn: {
    backgroundColor: "white",
    alignSelf: "flex-end",
  },
  circleOff: {
    backgroundColor: "white",
    alignSelf: "flex-start",
  },
  buttonsContainer: {
    width: "100%",
    gap: 12,
  },
  settingButton: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#E3E4E8",
  },
  settingButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dangerButton: {
    backgroundColor: "#F5E5E5",
  },
  dangerText: {
    color: "#D9534F",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
  },
  closeIcon: {
    alignSelf: "flex-end",
    padding: 4,
    marginBottom: 4,
  },
});
