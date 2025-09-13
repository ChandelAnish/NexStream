import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Doctor, FileData, DoctorOnboardingState, PersonalInfo, ProfessionalDetails, VerificationDocument, WorkSchedulePreferences } from "@/types/doctor";

// Helper function to convert File to Base64
// const fileToBase64 = (file: File): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => {
//       const result = reader.result as string;
//       // Remove the data:mime/type;base64, prefix
//       const base64 = result.split(',')[1];
//       resolve(base64);
//     };
//     reader.onerror = (error) => reject(error);
//   });
// };

// Initial state
const initialState: DoctorOnboardingState = {
  currentStep: 1,
  personalInfo: {
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "Male",
    profilePhoto: null,
  },
  professionalDetails: {
    medicalLicenseNumber: "",
    specialization: "",
    yearsOfExperience: "",
    associatedClinicHospitalName: "",
    consultationType: "In-Person",
  },
  verificationDocument: {
    governmentIssuedId: null,
    medicalDegreeCertificate: null,
    medicalCouncilRegistrationCertificate: null,
    experienceCertificate: null,
  },
  workSchedulePreferences: {
    availableConsultationHours: "",
    preferredModeOfConsultation: "",
    languageSpoken: "",
    additionalInformation: "",
    emergencyContactDetails: "",
    personalBio: "",
  },
  isLoading: false,
  error: null,
  isSubmitted: false,
  doctors: [],
  isLoadingDoctors: false,
};

// Helper function to convert Base64 back to File
export const base64ToFile = (fileData: FileData): File => {
  const byteCharacters = atob(fileData.base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], fileData.name, {
    type: fileData.type,
    lastModified: fileData.lastModified,
  });
};

// Async thunk for submitting data
export const submitDoctorOnboarding = createAsyncThunk(
  "doctorOnboarding/submit",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { doctorOnboarding: DoctorOnboardingState };
      const {
        personalInfo,
        professionalDetails,
        verificationDocument,
        workSchedulePreferences,
      } = state.doctorOnboarding;

      // Create FormData for file uploads
      const formData = new FormData();

      // Add personal info
      Object.entries(personalInfo).forEach(([key, value]) => {
        if (key === "profilePhoto" && value) {
          const file = base64ToFile(value as FileData);
          formData.append("profilePhoto", file);
        } else if (key !== "profilePhoto") {
          formData.append(key, value as string);
        }
      });

      // Add professional details
      Object.entries(professionalDetails).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Add verification documents
      Object.entries(verificationDocument).forEach(([key, value]) => {
        if (value) {
          const file = base64ToFile(value as FileData);
          formData.append(key, file);
        }
      });

      // Add work schedule preferences
      Object.entries(workSchedulePreferences).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await fetch(
        "http://localhost:3000/api/doctor",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit onboarding data");
      }

      const result = await response.json();

      // Clear session storage on successful submission
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("doctorOnboardingData");
      }

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  }
);

// Async thunk for getting doctor data
export const getDoctors = createAsyncThunk(
  "doctorOnboarding/getDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/doctor`
      );
      console.log(data);
      return data as Doctor[];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  }
);

// Helper function to load from session storage
const loadFromSessionStorage = (): Partial<DoctorOnboardingState> => {
  if (typeof window === "undefined") return {};

  try {
    const saved = sessionStorage.getItem("doctorOnboardingData");
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

// Helper function to save to session storage
const saveToSessionStorage = (state: DoctorOnboardingState) => {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem("doctorOnboardingData", JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save to session storage:", error);
  }
};

// Create slice
const doctorOnboardingSlice = createSlice({
  name: "doctorOnboarding",
  initialState: {
    ...initialState,
    ...loadFromSessionStorage(),
  },
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },

    updatePersonalInfo: (
      state,
      action: PayloadAction<Partial<PersonalInfo>>
    ) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },

    updateProfessionalDetails: (
      state,
      action: PayloadAction<Partial<ProfessionalDetails>>
    ) => {
      state.professionalDetails = {
        ...state.professionalDetails,
        ...action.payload,
      };
    },

    updateVerificationDocument: (
      state,
      action: PayloadAction<Partial<VerificationDocument>>
    ) => {
      state.verificationDocument = {
        ...state.verificationDocument,
        ...action.payload,
      };
    },

    updateWorkSchedulePreferences: (
      state,
      action: PayloadAction<Partial<WorkSchedulePreferences>>
    ) => {
      state.workSchedulePreferences = {
        ...state.workSchedulePreferences,
        ...action.payload,
      };
    },

    nextStep: (state) => {
      if (state.currentStep < 4) {
        state.currentStep += 1;
      }
      saveToSessionStorage(state);
    },

    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },

    resetForm: (state) => {
      Object.assign(state, initialState);
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("doctorOnboardingData");
      }
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitDoctorOnboarding.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitDoctorOnboarding.fulfilled, (state) => {
        state.isLoading = false;
        state.isSubmitted = true;
        state.error = null;
      })
      .addCase(submitDoctorOnboarding.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getDoctors.pending, (state) => {
        state.isLoadingDoctors = true;
        state.error = null;
      })
      .addCase(getDoctors.fulfilled, (state, action) => {
        state.isLoadingDoctors = false;
        console.log(action.payload)
        state.doctors = action.payload;
        state.error = null;
      })
      .addCase(getDoctors.rejected, (state, action) => {
        state.isLoadingDoctors = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentStep,
  updatePersonalInfo,
  updateProfessionalDetails,
  updateVerificationDocument,
  updateWorkSchedulePreferences,
  nextStep,
  previousStep,
  resetForm,
  clearError,
} = doctorOnboardingSlice.actions;

export default doctorOnboardingSlice.reducer;
