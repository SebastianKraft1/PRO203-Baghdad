/*
  Modal for å velge eller ta et bilde. 
  Brukeren kan enten åpne kamerarullen eller ta bilde med kameraet.
  Bildet sendes tilbake til foreldre-komponenten via setImage og modalen lukkes etterpå.
*/

import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRef } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type SelectImageModalProps = {
  closeModal: VoidFunction;
  setImage: (image: string) => void;
};

export default function SelectImageModal({
  closeModal,
  setImage,
}: SelectImageModalProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  // Hvis permission-data ikke er lastet ennå
  if (!permission) {
    return <View />;
  }

  // Hvis brukeren ikke har gitt tillatelse
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Vi trenger tillatelse til å bruke kameraet</Text>
        <Button onPress={requestPermission} title="Gi tillatelse" />
      </View>
    );
  }

  // Velg bilde fra kamerarull
  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); //Hent ut uri til bildet og send det videre ut til PostFormModal
      closeModal();
    }
  }

  // Ta bilde med kamera
  async function captureImage() {
    if (cameraRef.current) {
      const image = await cameraRef.current.takePictureAsync();
      if (image) {
        setImage(image.uri);
        closeModal();
      }
    }
  }

  // Kamera og knapper
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back" ref={cameraRef} />
      {/* Avbryt */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => closeModal()}>
          <Text style={styles.text}>Avbryt</Text>
        </TouchableOpacity>

        {/* Ta bilde */}
        <TouchableOpacity style={styles.button} onPress={() => captureImage()}>
          <Text style={styles.text}>Ta bilde</Text>
        </TouchableOpacity>

        {/* Velg fra kamerarull */}
        <TouchableOpacity style={styles.button} onPress={() => pickImage()}>
          <Text style={styles.text}>Velg...</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
