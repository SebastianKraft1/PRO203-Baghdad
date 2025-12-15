/* 
  Modal for å registrere et nytt barn til brukeren.
  Brukeren kan fylle inn navn, alder, allergier og avdeling,
  og sende dataen til Firestore via API.
*/

import { createChild } from "@/api/childrenApi";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// Props for modal
export type RegisterChildModalProps = {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  userId: string;
  confirmChildAdded: VoidFunction;
};

// Håndterer registrering av nytt barn
export default function RegisterChildModal({
  isVisible,
  setIsVisible,
  userId,
  confirmChildAdded,
}: RegisterChildModalProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState<string>("");
  const [allergies, setAllergies] = useState("");
  const [department, setDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleAddChild() {
    if (!name || !age) return;

    try {
      setIsLoading(true);

      // Kaller API for å opprette barn i Firestore
      await createChild(userId, {
        name,
        age: Number(age),
        allergies,
        department,
      });

      // Resetter inputfeltet etter registrering
      setName("");
      setAge("");
      setAllergies("");
      setDepartment("");

      // Callback for å oppdatere foreldre komponenten
      confirmChildAdded();
      setIsVisible(false);
    } catch (e) {
      console.error("Error creating child:", e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal transparent visible={isVisible} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Registrer barn</Text>

          {isLoading ? (
            <ActivityIndicator size="large" color="#5B2C6F" />
          ) : (
            <>
              {/* Input-felt for barnets data */}
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Barnets navn"
                style={styles.textInput}
              />
              <TextInput
                value={age}
                onChangeText={setAge}
                placeholder="Alder"
                keyboardType="numeric"
                style={styles.textInput}
              />
              <TextInput
                value={allergies}
                onChangeText={setAllergies}
                placeholder="Allergier"
                style={styles.textInput}
              />
              <TextInput
                value={department}
                onChangeText={setDepartment}
                placeholder="Avdeling"
                style={styles.textInput}
              />

              {/* Knapper for legg til / lukk */}
              <View style={styles.buttonContainer}>
                <Pressable
                  style={[styles.button, styles.primaryButton]}
                  onPress={handleAddChild}
                >
                  <Text style={styles.buttonText}>Legg til</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => setIsVisible(false)}
                >
                  <Text style={styles.buttonText}>Lukk</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#EDE6FF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    color: "#5B2C6F",
  },
  textInput: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#5B2C6F",
    marginRight: 8,
  },
  secondaryButton: {
    backgroundColor: "#ccc",
    marginLeft: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
