import { auth } from "@/firebaseConfig";
import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  updatePassword,
  updateProfile,
  User
} from "firebase/auth";
import { createUserProfile } from "./userApi";
import { Alert } from "react-native";

export async function signIn(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("User signed in ", userCredential);
    })
    .catch((error) => console.log("Oops, kunne ikke logge inn", error));
}

export async function signOut() {
  await auth.signOut();
}

export async function createUser(
  email: string,
  password: string,
  userName?: string
) {
  console.log("Epost", email);
  console.log("password", password);
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredentials.user;
    if (userName) {
      await updateProfile(user, {
        displayName: userName,
      });
    }

    await createUserProfile(user.uid, {
      id: user.uid,
      name: userName || email.split("@")[0],
      email: email,
      bio: "",
      profileImagePath: "",
      role: "Foresatt",
      registeredChildren: 0,
    });

    console.log("Bruker og profil opprettet i både Auth og Firestore!");
    return user;
  } catch (error) {
    console.error("Oops! kunne ikke opprette bruker", error);
    return null;
  }
}

export async function setUserDisplayName(user: User, displayName: string) {
  try {
    await updateProfile(user, {
      displayName: displayName,
    });
  } catch (error) {
    console.error("Oops! kunne ikke oppdatere display name", error);
  }
}

export async function signInWithGoogle() {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    if (isSuccessResponse(response)) {
      const user = GoogleSignin.getCurrentUser();
      if (user) {
        const googleCredential = GoogleAuthProvider.credential(user.idToken);
        const userCredential = await signInWithCredential(
          auth,
          googleCredential
        );
      }
    }
  } catch (e) {
    console.error("Error signing in with google", e);
  }
}

export async function signInWithApple() {
  try {
    const appleCredential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!appleCredential.identityToken) {
      console.error("No identity token returned");
      return;
    }

    const provider = new OAuthProvider("apple.com");
    const credential = provider.credential({
      idToken: appleCredential.identityToken,
    });

    const userCredential = await signInWithCredential(auth, credential);
    console.log("Apple sign-in successful", userCredential);
  } catch (e) {
    console.log("Error signing in with apple", e);
  }
}

export async function deleteAccount() {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.warn("No user is currently signed in.");
    return;
  }

  try {
    await deleteUser(currentUser);
    console.log("User account deleted successfully.");
    Alert.alert("Konto slettet", "Din konto har blitt slettet.");
  } catch (error: any) {
    console.error("Error deleting user account:", error);

    if (error?.code === 'auth/requires-recent-login') {
      Alert.alert(
        "Handling krever ny pålogging",
        "For å slette kontoen din, vennligst logg inn på nytt og prøv igjen."
      );
    } else {
      Alert.alert(
        "Feil",
        "Kunne ikke slette kontoen. Vennligst prøv igjen senere."
      );
    }
  }
}

export async function changePassword(newPassword: string) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.warn("No user is currently signed in.");
    return;
  }
  
  try {
    await updatePassword(currentUser, newPassword);
    console.log("Password updated successfully.");
  } catch (error) {
    console.error("Error updating password:", error);
  }
}
