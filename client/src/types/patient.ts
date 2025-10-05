export interface patient {
  /* Core identifiers – always present */
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  supabaseUid: string;

  /* Basic contacts */
  phone?: string | null;

  /* Demographic data */
  title?: string | null;
  name?: string | null;
  birthDate?: Date | null;
  gender?: string | null;
  bloodGroup?: string | null;
  height?: number | null;
  weight?: number | null;
  maritalStatus?: string | null;
  contactNumber?: string | null;
  alternateNumber?: string | null;

  /* Lifestyle data */
  smokingHabit?: string | null;
  alcoholConsumption?: string | null;
  activityLevel?: string | null;
  dietHabit?: string | null;
  occupation?: string | null;

  /* Medical data */
  allergies?: string[] | null;
  medications?: string[] | null;
  chronicDiseases?: string[] | null;
  injuries?: string[] | null;
  surgeries?: string[] | null;
}
