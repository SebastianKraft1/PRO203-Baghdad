/*
  Grensesnitt for barn som er registret i SafeDrop.
  Brukes til visning, innsjekk/utsjekk og historikk.
*/

export interface Child {
  id: string;
  name: string;
  age: number;
  isCheckedIn: boolean;
  status: "Hentet" | "Innsjekket";
  allergies?: string;
  department?: string;
  createdAt: number;

  checkInTime?: string;
  checkOutTime?: string; 
  checkInHistory?: string[];
  checkOutHistory?: string[];
}
