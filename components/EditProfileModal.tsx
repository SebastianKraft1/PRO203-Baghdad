import { deleteChild, listenToChildren } from "@/api/childrenApi";
import { getUserProfile, updateUserProfile } from "@/api/userApi";
import { auth } from "@/firebaseConfig";
import { Child } from "@/types/child";
import { UserData } from "@/types/user";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type EditProfileModalProps = {
    onClose: () => void;
};

export default function EditProfileModal({ onClose }: EditProfileModalProps) {
    const [profile, setProfile] = useState<UserData | null>(null);
    const [children, setChildren] = useState<Child[]>([]);
    const [childrenToRemove, setChildrenToRemove] = useState<string[]>([]);

    const [emailInput, setEmailInput] = useState("");
    const [usernameInput, setUsernameInput] = useState("");
    const [phoneInput, setPhoneInput] = useState("");

    const userId = auth.currentUser?.uid;

    useEffect(() => {
        if (!userId) return;

        const fetchProfile = async () => {
            const data = await getUserProfile(userId);
            if (data) {
                setProfile(data);
                setEmailInput(data.email ?? "");
                setUsernameInput(data.name ?? "");

                const anyData = data as any;
                setPhoneInput(anyData.phone ?? "");
            }
        };
        fetchProfile();
    }, [userId]);

    useEffect(() => {
        if (!userId) return;

        const stopListening = listenToChildren(userId, (childrenData: Child[]) => {
            setChildren(childrenData);
        });

        return () => stopListening();
    }, [userId]);

    const handleToggleRemoveChild = (childId: string) => {
        setChildrenToRemove((prev) => 
            prev.includes(childId)
                ? prev.filter((id) => id !== childId)
                : [...prev, childId]
        );
    };

    const handleSaveProfile = async () => {
        if (!userId) return;

        try {
            await updateUserProfile(userId, {
                email: emailInput,
                name: usernameInput || null,
                phone: phoneInput || null,
            });

            setProfile((prev) => 
                prev ? {
                    ...prev,
                    email: emailInput,
                } : prev
            );

            for (const childId of childrenToRemove) {
                await deleteChild(userId, childId);
            }

            setChildrenToRemove([])
            Alert.alert("Lagret", "Kontoinformasjon er oppdatert.");
            onClose();
        } catch (e) {
            console.error("Error updating profile", e);
            Alert.alert("Feil", "Kunne ikke oppdatere konto.");
        }
    };

    // kanskje slett
    const handleRemoveChild = (childId: string) => {
        if (!userId) return;

        Alert.alert(
            "Fjern barn",
            "Er du sikker på at du vil fjerne dette barnet?",
            [
                {text: "Avbryt", style: "cancel"},
                {
                    text: "Fjern",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteChild(userId, childId);
                        } catch (e) {
                            console.error("Error deleting child", e);
                            Alert.alert("Feil", "Kunne ikke fjerne barnet.");
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.editCard}>
            <Text style={styles.editTitle}>Rediger konto</Text>

            <TextInput 
                style={styles.input}
                value={emailInput}
                onChangeText={setEmailInput}
                placeholder="E-post"
                keyboardType="email-address"
            />
            <TextInput 
                style={styles.input}
                value={usernameInput}
                onChangeText={setUsernameInput}
                placeholder="Navn / Brukernavn"
            />
            <TextInput 
                style={styles.input}
                value={phoneInput}
                onChangeText={setPhoneInput}
                placeholder="Telefonnummer"
                keyboardType="phone-pad"
            />

            <View style={styles.buttonRow}>
                <Pressable style={styles.cancelButton} onPress={onClose}>
                    <Text style={styles.cancelText}>Avbryt</Text>
                </Pressable>
                <Pressable style={styles.saveButton} onPress={handleSaveProfile}>
                    <Text style={styles.saveText}>Lagre endringer</Text>
                </Pressable>
            </View>

            <View style={styles.childrenSection}>
                <Text style={styles.childrenTitle}>Registrerte barn</Text>

                {children.length === 0 && (
                    <Text style={styles.noChildrenText}>Ingen registrerte barn</Text>
                )}

                {children.map((child) => {
                    const markedRemoval = childrenToRemove.includes(child.id);
                    return (
                        <View key={child.id} style={styles.childRow}>
                            <View style={{flex: 1}}>
                                <Text style={styles.childName}>{child.name}</Text>
                                <Text style={styles.childSubText}>
                                    Alder: {child.age} * {child.department || "Uten avdeling"}
                                </Text>
                                {markedRemoval && (
                                    <Text style={styles.removeLabel}>Vil fjernes</Text>
                                )}
                            </View>
                            <Pressable
                                style={[
                                    styles.removeChildButton,
                                    markedRemoval && styles.removeChildBtnActive,
                                ]}
                                onPress={() => handleToggleRemoveChild(child.id)}
                            >
                                <FontAwesome name="ban" size={16} color={markedRemoval ? "#FFFFFF" : "#DC2626"} />
                            </Pressable>
                        </View>
                    )
                })}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    editCard: {
        width: "100%",
        backgroundColor: "#F4F4FB",
        borderRadius: 16,
        padding: 16,
    },
    editTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
    },
    input: {
        width: "100%",
        backgroundColor: "white",
        borderRadius: 999,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 8,
        marginBottom: 12,
    },
    cancelButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: "#E5E7EB",
    },
    cancelText: {
        fontSize: 14,
    },
    saveButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: "#6d61bcff",
    },
    saveText: {
        color: "white",
        fontWeight: "600",
        fontSize: 14,
    },
    childrenSection: {
        marginTop: 8,
    },
    childrenTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 6,
    },
    noChildrenText: {
        fontSize: 14,
        color: "#6B7280",
    },
    childRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
    },
    childName: {
        fontSize: 15,
        fontWeight: "500",
    },
    childSubText: {
        fontSize: 13,
        color: "#6B7280",
    },
    removeLabel: {
        marginTop: 2,
        fontSize: 12,
        color: "#DC2626"
    },
    removeChildButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#FCA5A5",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FEE2E2",
    },
    removeChildBtnActive: {
        backgroundColor: "#DC2626",
        borderColor: "#DC2626",
    },
})