/*
  Grensesnitt for en bruker i SafeDrop.
  Brukes til profil og visning.
*/

export interface UserData {
  id: string;
  name: string;
  email: string;
  bio: string;
  profileImage?: string;
  profileImagePath: string;
  role: "Foresatt" | "Ansatt";
  registeredChildren?: number;
  phone?: string;
}
