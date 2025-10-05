"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, FileText, Download, Users, User } from "lucide-react";
import * as XLSX from "xlsx";
import axios from "axios";
import { patient } from "@/types/patient";
import { DoctorDB } from "@/types/doctor";

// Types for raw CSV/Excel data
interface RawDoctorData {
  "Full Name"?: string;
  "Email Address"?: string;
  "Phone Number"?: string;
  "Date of Birth"?: string;
  "Gender"?: string;
  "Medical License Number"?: string;
  "Specialization"?: string;
  "Years of Experience"?: string;
  "Associated Clinic Hospital Name"?: string;
  "Consultation Type"?: string;
  "Available Consultation Hours"?: string;
  "Preferred Mode of Consultation"?: string;
  "Language Spoken"?: string;
  "Emergency Contact Details"?: string;
  "Personal Bio"?: string;
  "Additional Information"?: string;
  "Medical School Name"?: string;
  "Medical School Graduation Year"?: string;
  "Medical School Degree"?: string;
}

interface RawPatientData {
  "Email"?: string;
  "Phone"?: string;
  "Title"?: string;
  "Name"?: string;
  "Birth Date"?: string;
  "Gender"?: string;
  "Blood Group"?: string;
  "Height (cm)"?: string;
  "Weight (kg)"?: string;
  "Marital Status"?: string;
  "Contact Number"?: string;
  "Alternate Number"?: string;
  "Smoking Habit"?: string;
  "Alcohol Consumption"?: string;
  "Activity Level"?: string;
  "Diet Habit"?: string;
  "Occupation"?: string;
  "Allergies"?: string;
  "Medications"?: string;
  "Chronic Diseases"?: string;
  "Injuries"?: string;
  "Surgeries"?: string;
}

// Types for bulk upload (omitting auto-generated fields)
type DoctorBulkUpload = Omit<DoctorDB, 'id' | 'createdAt' | 'updatedAt'>;
type PatientBulkUpload = Omit<patient, 'id' | 'createdAt' | 'updatedAt' | 'supabaseUid'>;

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  uploadType: "doctor" | "patient";
}

type UploadStatus = "idle" | "processing" | "uploading" | "success" | "error";

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  isOpen,
  onClose,
  uploadType = "patient",
}) => {
  const [currentScreen, setCurrentScreen] = useState<"selection" | "upload">(
    "selection"
  );
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Animation variants
  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 400,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.1,
        duration: 0.3,
      },
    },
    exit: { opacity: 0, x: -20 },
  };

  // Sample data templates
  const sampleTemplates = {
    doctor: {
      headers: [
        "Full Name",
        "Email Address",
        "Phone Number",
        "Date of Birth",
        "Gender",
        "Medical License Number",
        "Specialization",
        "Years of Experience",
        "Associated Clinic Hospital Name",
        "Consultation Type",
        "Available Consultation Hours",
        "Preferred Mode of Consultation",
        "Language Spoken",
        "Emergency Contact Details",
        "Personal Bio",
        "Additional Information",
        "Medical School Name",
        "Medical School Graduation Year",
        "Medical School Degree",
      ],
      sampleData: [
        "Dr. John Smith",
        "john.smith@email.com",
        "+1234567890",
        "1980-05-15",
        "Male",
        "ML123456",
        "Cardiology",
        "10",
        "City General Hospital",
        "Online",
        "9 AM - 5 PM",
        "Video Call",
        "English, Spanish",
        "+1987654321",
        "Experienced cardiologist",
        "Available for emergency consultations",
        "Harvard Medical School",
        "2010",
        "MD",
      ],
    },
    patient: {
      headers: [
        "Email",
        "Phone",
        "Title",
        "Name",
        "Birth Date",
        "Gender",
        "Blood Group",
        "Height (cm)",
        "Weight (kg)",
        "Marital Status",
        "Contact Number",
        "Alternate Number",
        "Smoking Habit",
        "Alcohol Consumption",
        "Activity Level",
        "Diet Habit",
        "Occupation",
        "Allergies",
        "Medications",
        "Chronic Diseases",
        "Injuries",
        "Surgeries",
      ],
      sampleData: [
        "jane.doe@email.com",
        "+1234567890",
        "Ms.",
        "Jane Doe",
        "1990-03-20",
        "Female",
        "O+",
        "165",
        "60",
        "Single",
        "+1234567890",
        "+1987654321",
        "Non-smoker",
        "Occasional",
        "Moderate",
        "Vegetarian",
        "Software Engineer",
        "Peanuts,Shellfish",
        "Vitamin D,Multivitamin",
        "Diabetes",
        "None",
        "Appendectomy 2019",
      ],
    },
  };

  const downloadSampleCSV = (): void => {
    const template = sampleTemplates[uploadType];
    const csvContent = [
      template.headers.join(","),
      template.sampleData.join(","),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${uploadType}_sample_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      const fileName = selectedFile.name;

      const validTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      const validExtensions =
        fileName.endsWith(".csv") ||
        fileName.endsWith(".xlsx") ||
        fileName.endsWith(".xls");

      if (validTypes.includes(fileType) || validExtensions) {
        setFile(selectedFile);
        setUploadStatus("idle");
        setStatusMessage("");
      } else {
        setUploadStatus("error");
        setStatusMessage("Please select a valid CSV or Excel file");
      }
    }
  };

  const parseFileData = async (file: File): Promise<RawDoctorData[] | RawPatientData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          if (file.name.endsWith(".csv")) {
            const text = e.target?.result as string;
            const rows = text
              .split("\n")
              .map((row) =>
                row.split(",").map((cell) => cell.trim().replace(/"/g, ""))
              );
            const headers = rows[0];
            const dataRows = rows
              .slice(1)
              .filter((row) => row.some((cell) => cell.length > 0));

            const parsedData = dataRows.map((row) => {
              const obj: Record<string, string> = {};
              headers.forEach((header, index) => {
                obj[header] = row[index] || "";
              });
              return obj;
            });

            const data = parsedData as unknown as RawDoctorData[] | RawPatientData[];
            resolve(data);
          } else {
            const workbook = XLSX.read(e.target?.result, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const xlsxData = XLSX.utils.sheet_to_json(worksheet);
            
            const data = xlsxData as unknown as RawDoctorData[] | RawPatientData[];
            resolve(data);
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));

      if (file.name.endsWith(".csv")) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const transformDataForAPI = (rawData: RawDoctorData[] | RawPatientData[]): DoctorBulkUpload[] | PatientBulkUpload[] => {
    if (uploadType === "doctor") {
      return (rawData as RawDoctorData[]).map((row): DoctorBulkUpload => ({
        fullName: row["Full Name"] || "",
        emailAddress: row["Email Address"] || "",
        phoneNumber: row["Phone Number"] || "",
        dateOfBirth: row["Date of Birth"] || "",
        gender: row["Gender"] || "",
        medicalLicenseNumber: row["Medical License Number"] || "",
        specialization: row["Specialization"] || "",
        yearsOfExperience: row["Years of Experience"] || "",
        associatedClinicHospitalName: row["Associated Clinic Hospital Name"] || "",
        consultationType: row["Consultation Type"] || "",
        availableConsultationHours: row["Available Consultation Hours"] || "",
        preferredModeOfConsultation: row["Preferred Mode of Consultation"] || "",
        languageSpoken: row["Language Spoken"] || "",
        emergencyContactDetails: row["Emergency Contact Details"] || "",
        personalBio: row["Personal Bio"] || null,
        additionalInformation: row["Additional Information"] || null,
        medicalSchoolName: row["Medical School Name"] || null,
        medicalSchoolGraduationYear: row["Medical School Graduation Year"] || null,
        medicalSchoolDegree: row["Medical School Degree"] || null,
        profilePhoto: null,
        governmentIssuedId: null,
        medicalDegreeCertificate: null,
        medicalCouncilRegistrationCertificate: null,
        experienceCertificate: null,
      }));
    } else {
      return (rawData as RawPatientData[]).map((row): PatientBulkUpload => {
        // Helper function to split comma-separated values into arrays
        const splitToArray = (value: string): string[] | null => {
          if (!value || value.trim() === "" || value.toLowerCase() === "none") return null;
          return value
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item.length > 0);
        };

        // Parse birth date
        const birthDate = row["Birth Date"] ? new Date(row["Birth Date"]) : null;

        return {
          email: row["Email"] || "",
          phone: row["Phone"] || null,
          title: row["Title"] || null,
          name: row["Name"] || null,
          birthDate: birthDate,
          gender: row["Gender"] || null,
          bloodGroup: row["Blood Group"] || null,
          height: row["Height (cm)"] ? parseInt(row["Height (cm)"]) : null,
          weight: row["Weight (kg)"] ? parseInt(row["Weight (kg)"]) : null,
          maritalStatus: row["Marital Status"] || null,
          contactNumber: row["Contact Number"] || null,
          alternateNumber: row["Alternate Number"] || null,
          smokingHabit: row["Smoking Habit"] || null,
          alcoholConsumption: row["Alcohol Consumption"] || null,
          activityLevel: row["Activity Level"] || null,
          dietHabit: row["Diet Habit"] || null,
          occupation: row["Occupation"] || null,
          allergies: splitToArray(row["Allergies"] || ""),
          medications: splitToArray(row["Medications"] || ""),
          chronicDiseases: splitToArray(row["Chronic Diseases"] || ""),
          injuries: splitToArray(row["Injuries"] || ""),
          surgeries: splitToArray(row["Surgeries"] || ""),
        };
      });
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!file) {
      setUploadStatus('error');
      setStatusMessage('Please select a file first');
      return;
    }

    setUploadStatus('processing');
    setStatusMessage('Processing file...');

    try {
      const rawData = await parseFileData(file);
      const transformedData = transformDataForAPI(rawData);

      setUploadStatus('uploading');
      setStatusMessage('Uploading data...');
      console.log(transformedData);
      
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/${uploadType}/bulk-upload`, {
        data: transformedData
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log(data);
      setUploadStatus('success');
      setStatusMessage(`Successfully uploaded ${transformedData.length} ${uploadType} records!`);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      setUploadStatus('error');
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          setStatusMessage('Upload timeout. Please try again.');
        } else if (error.response) {
          setStatusMessage(`Upload failed: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
        } else if (error.request) {
          setStatusMessage('Network error. Please check your connection.');
        } else {
          setStatusMessage(`Error: ${error.message}`);
        }
      } else {
        setStatusMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleClose = (): void => {
    setCurrentScreen("selection");
    setFile(null);
    setUploadStatus("idle");
    setStatusMessage("");
    onClose();
  };

  const getStatusColor = (status: UploadStatus): string => {
    switch (status) {
      case "error":
        return "bg-red-50 text-red-700 border-red-200";
      case "success":
        return "bg-green-50 text-green-700 border-green-200";
      case "processing":
      case "uploading":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-teal-100">
              <motion.h2 className="text-xl font-semibold text-teal-800" layout>
                {currentScreen === "selection"
                  ? `Add New ${
                      uploadType.charAt(0).toUpperCase() + uploadType.slice(1)
                    }s`
                  : "Bulk Upload"}
              </motion.h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-white/50 transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Content - Fixed height container */}
            <div className="p-6 h-96 flex flex-col">
              <AnimatePresence mode="wait">
                {currentScreen === "selection" ? (
                  <motion.div
                    key="selection"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex-1 flex flex-col justify-center"
                  >
                    <div className="flex gap-4 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 px-6 py-3 border-2 border-gray-200 rounded-xl text-gray-700 hover:border-teal-300 hover:bg-teal-50 transition-all duration-200 font-medium"
                      >
                        <User size={20} />
                        Individual
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCurrentScreen("upload")}
                        className="flex items-center gap-3 px-6 py-3 border-2 border-gray-200 rounded-xl text-gray-700 hover:border-teal-300 hover:bg-teal-50 transition-all duration-200 font-medium"
                      >
                        <Users size={20} />
                        Bulk
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex-1 flex flex-col space-y-6"
                  >
                    {/* File Upload Area */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-teal-400 hover:bg-teal-50/30 transition-all duration-300 flex-1 flex flex-col justify-center"
                    >
                      <motion.div
                        animate={{
                          y: [0, -5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <FileText
                          className="mx-auto mb-4 text-gray-400"
                          size={40}
                        />
                      </motion.div>

                      <div className="mb-4">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".csv,.xlsx,.xls"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => fileInputRef.current?.click()}
                          className="text-teal-600 hover:text-teal-700 font-semibold text-lg hover:underline transition-colors"
                        >
                          Choose file(.csv, .xls)
                        </motion.button>
                      </div>

                      <AnimatePresence>
                        {file && (
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-sm text-gray-600 mb-4 font-medium"
                          >
                            {file.name}
                          </motion.p>
                        )}
                      </AnimatePresence>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={downloadSampleCSV}
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center justify-center gap-2 mx-auto font-medium hover:underline transition-colors"
                      >
                        <Download size={16} />
                        Download Template
                      </motion.button>
                    </motion.div>

                    {/* Status Message */}
                    <AnimatePresence>
                      {statusMessage && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className={`p-3 rounded-xl text-sm font-medium border ${getStatusColor(
                            uploadStatus
                          )}`}
                        >
                          <div className="flex items-center gap-2">
                            {(uploadStatus === "processing" ||
                              uploadStatus === "uploading") && (
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                            )}
                            {statusMessage}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCurrentScreen("selection")}
                        disabled={
                          uploadStatus === "processing" ||
                          uploadStatus === "uploading"
                        }
                        className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleUpload}
                        disabled={
                          !file ||
                          uploadStatus === "processing" ||
                          uploadStatus === "uploading"
                        }
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:from-teal-700 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
                      >
                        {uploadStatus === "processing" ||
                        uploadStatus === "uploading" ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            {uploadStatus === "processing"
                              ? "Processing..."
                              : "Uploading..."}
                          </>
                        ) : (
                          <>
                            <Upload size={18} />
                            Upload
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkUploadModal;