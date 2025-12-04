import * as authApi from "@/api/authApi";
import { useAuthSession } from "@/providers/authctx";
import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const Authentication = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSignUp, setIsSignUp] = useState(false);

  const { signIn, createUser } = useAuthSession();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={-50}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.mainContainer}>

          <Image source={require("../assets/images/safedrop-logo.png")} style={styles.logo} resizeMode="contain"  />

          <View style={styles.cardContainer}>
            {isSignUp && (
              <View style={styles.textFieldContainer}>
                <Text style={{marginBottom: 8}}>Brukernavn</Text>
                <TextInput
                  value={userName}
                  onChangeText={setUserName}
                  style={styles.textField}
                  placeholder="Brukernavn"
                />
              </View>
            )}
            <View style={styles.textFieldContainer}>
              <Text style={{marginBottom: 8}}>E-postadresse</Text>
              <TextInput
                value={userEmail}
                onChangeText={setUserEmail}
                style={styles.textField}
                placeholder="Epost"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.textFieldContainer}>
              <Text style={{marginBottom: 8}}>Passord</Text>
              <TextInput
                value={password}
                secureTextEntry={true}
                onChangeText={setPassword}
                style={styles.textField}
                placeholder="Passord"
              />
            </View>
            <View style={styles.buttonContainer}>
              <Pressable
                style={styles.primaryButton}
                onPress={() => {
                  if (isSignUp) {
                    createUser(userEmail, password, userName);
                  } else {
                    signIn(userEmail, password);
                  }
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  {isSignUp ? "Lag bruker" : "Logg inn"}
                </Text>
              </Pressable>
            </View>
            <Pressable
              style={{
                paddingTop: 24,
              }}
              onPress={() => {
                setIsSignUp(!isSignUp);
              }}
            >
              <Text
                style={{
                  textDecorationLine: "underline",
                }}
              >
                {isSignUp ? "Registrering" : "Innlogging"}
              </Text>
            </Pressable>
          </View>
          
          {/* Google og Apple innlogging */}
          <View style={styles.socialButtonsContainer}>
                {/* Google sign-in */}
              <Pressable
                style={[styles.socialButton, styles.googleButton, styles.iconButton]}
                onPress={async () => {
                  await authApi.signInWithGoogle();
                }}
              >
                <AntDesign name="google" size={24} color="black" style={styles.icon} />
                <Text
                  style={styles.socialButtonText}
                >
                  Logg inn med Google
                </Text>
              </Pressable>
              {/* Apple sign-in */}
              {Platform.OS === "ios" && (
                <Pressable
                  style={[styles.socialButton, styles.appleButton, styles.iconButton]}
                  onPress={async () => {
                    await authApi.signInWithApple();
                  }}
                >
                  <AntDesign name="apple" size={24} color="white" style={styles.icon}/>
                  <Text
                    style={[styles.socialButtonText, { color: "white" }]}
                  >
                    Logg inn med Apple
                  </Text>
                </Pressable>
              )}
          </View>

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Authentication;

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 24,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 8,
  },
  cardContainer: {
    width: "100%",
    maxWidth: 300,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  primaryButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    backgroundColor: "#6c97feff",
    borderColor: "black",
    borderWidth: 1,
    width: "100%",
  },
  secondaryButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "gray",
  },
  textFieldContainer: {
    width: "100%",
    paddingTop: 16,
  },
  textField: {
    borderWidth: 1,
    padding: 10,
    marginTop: 2,
    borderColor: "#cacacaff",
    borderRadius: 12,
  },
  socialButtonsContainer: {
    width: "100%",
    marginTop: 24,
    gap: 12,
    alignItems: "center",
  },
  socialButton: {
    width: "80%",
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
  googleButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#dadce0",
  },
  appleButton: {
    backgroundColor: "black",
  },
  iconButton: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 6,
  },
});