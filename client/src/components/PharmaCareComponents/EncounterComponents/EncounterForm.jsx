import { useState } from "react";
import useEncounterStore from "../../../store/encounterStore";

const initialFormData = {
  encounterType: "outpatient",
  encounterDate: new Date().toISOString().slice(0, 10),

  admissionDate: "",
  dischargeDate: "",

  hospital: "",
  ward: "",
  bed: "",

  consultant: {
    name: "",
    specialty: "",
  },

  height: "",
  heightUnit: "cm",

  weight: "",
  weightUnit: "kg",

  presentingComplaints: "",
  complaintDuration: "",

  familyHistoryNotes: "",
  socialHistoryNotes: "",
  pastMedicalHistoryNotes: "",

  complianceHistory: "",
  medicationAllergyNotes: "",
  herbalMedicineNotes: "",
  currentMedicationComplaints: "",

  objectiveNotes: "",
  assessmentSummary: "",

  status: "open",
};

const encounterTypes = [
  { value: "admission", label: "Admission" },
  { value: "outpatient", label: "Outpatient" },
  {
    value: "pharmaceutical_care",
    label: "Pharmaceutical Care",
  },
  { value: "follow_up", label: "Follow-up" },
  { value: "discharge", label: "Discharge" },
  {
    value: "medication_review",
    label: "Medication Review",
  },
  { value: "other", label: "Other" },
];

const inputClass =
  "bg-transparent w-full rounded-md px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 border border-gray-300 focus:ring-blue-500";

const labelClass =
  "z-99 bg-white ml-3 -mb-2 block text-sm font-medium text-gray-700";

function FormField({ label, name, value, onChange, ...props }) {
  return (
    <div>
      <label
        className="z-99 bg-white ml-3 -mb-2 block text-sm font-medium text-gray-700"
        htmlFor={name}
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className={inputClass}
        {...props}
      />
    </div>
  );
}

function TextAreaField({ label, name, value, onChange, rows = 3 }) {
  return (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        rows={rows}
        className={inputClass}
      />
    </div>
  );
}

function Section({ title, description, children }) {
  return (
    <section className="space-y-4 rounded-lg border border-gray-200 p-5 bg-white shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>

      {children}
    </section>
  );
}

export default function EncounterForm({ patientId, onSuccess, onCancel }) {
  const { addEncounter } = useEncounterStore();

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setError("");
    setSuccess("");

    // Handle nested consultant fields.
    if (name.startsWith("consultant.")) {
      const consultantField = name.split(".")[1];

      setFormData((prev) => ({
        ...prev,
        consultant: {
          ...prev.consultant,
          [consultantField]: value,
        },
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // 1. Validate the patient selection.
    if (!patientId) {
      setError("Please select a patient before creating an encounter.");
      return;
    }

    // 2. Validate admission dates.
    if (
      formData.admissionDate &&
      formData.dischargeDate &&
      formData.dischargeDate < formData.admissionDate
    ) {
      setError("Discharge date cannot precede admission date.");
      return;
    }

    // 3. Convert numeric fields from input strings to numbers.
    const height = formData.height === "" ? undefined : Number(formData.height);

    const weight = formData.weight === "" ? undefined : Number(formData.weight);

    if (height !== undefined && (!Number.isFinite(height) || height <= 0)) {
      setError("Height must be a positive number.");
      return;
    }

    if (weight !== undefined && (!Number.isFinite(weight) || weight <= 0)) {
      setError("Weight must be a positive number.");
      return;
    }

    // 4. Construct the request body.
    const payload = {
      patient: patientId,

      encounterType: formData.encounterType,
      encounterDate: formData.encounterDate,

      admissionDate: formData.admissionDate || undefined,
      dischargeDate: formData.dischargeDate || undefined,

      hospital: formData.hospital.trim() || undefined,
      ward: formData.ward.trim() || undefined,
      bed: formData.bed.trim() || undefined,

      consultant: {
        name: formData.consultant.name.trim() || undefined,
        specialty: formData.consultant.specialty.trim() || undefined,
      },

      height,
      heightUnit: formData.heightUnit,
      weight,
      weightUnit: formData.weightUnit,

      presentingComplaints: formData.presentingComplaints.trim() || undefined,

      complaintDuration: formData.complaintDuration.trim() || undefined,

      familyHistoryNotes: formData.familyHistoryNotes.trim() || undefined,

      socialHistoryNotes: formData.socialHistoryNotes.trim() || undefined,

      pastMedicalHistoryNotes:
        formData.pastMedicalHistoryNotes.trim() || undefined,

      complianceHistory: formData.complianceHistory.trim() || undefined,

      medicationAllergyNotes:
        formData.medicationAllergyNotes.trim() || undefined,

      herbalMedicineNotes: formData.herbalMedicineNotes.trim() || undefined,

      currentMedicationComplaints:
        formData.currentMedicationComplaints.trim() || undefined,

      objectiveNotes: formData.objectiveNotes.trim() || undefined,

      assessmentSummary: formData.assessmentSummary.trim() || undefined,

      status: formData.status,
    };

    try {
      setLoading(true);

      // 5. Send the request to the backend.
      const response = await addEncounter(payload);

      console.log("Encounter submission response:", response);

      const savedEncounter = response.encounter;

      setSuccess(response.message || "Encounter saved successfully.");

      // 6. Notify the parent component.
      if (onSuccess) {
        onSuccess(savedEncounter);
      }

      // Reset the form while retaining a fresh default encounter date.
      setFormData({
        ...initialFormData,
        encounterDate: new Date().toISOString().slice(0, 10),
      });
    } catch (err) {
      console.error("Encounter submission error:", err);

      const responseData = err.response?.data;

      if (responseData?.errors?.length) {
        setError(responseData.errors.join(" "));
      } else {
        setError(
          responseData?.message ||
            "Unable to save the encounter. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!patientId) {
    return (
      <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-5">
        <p className="font-medium text-yellow-800">No patient selected.</p>

        <p className="mt-1 text-sm text-yellow-700">
          Select a patient before opening the encounter registration form.
        </p>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="mt-3 rounded-md border px-4 py-2"
          >
            Back to patient selection
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          New Clinical Encounter
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Record encounter details, patient history, and clinical findings.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700"
        >
          {success}
        </div>
      )}

      {/* SECTION 1: Encounter details */}

      <Section
        title="1. Encounter Details"
        description="Identify the type and date of the clinical encounter."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className={labelClass} htmlFor="encounterType">
              Encounter Type *
            </label>

            <select
              id="encounterType"
              name="encounterType"
              value={formData.encounterType}
              onChange={handleChange}
              className={inputClass}
              required
            >
              {encounterTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <FormField
            label="Encounter Date *"
            name="encounterDate"
            type="date"
            value={formData.encounterDate}
            onChange={handleChange}
            required
          />

          <div>
            <label className={labelClass} htmlFor="status">
              Encounter Status
            </label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="open">Open</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </Section>

      {/* SECTION 2: Admission information */}
      <Section
        title="2. Admission or Management Details"
        description="Complete these fields when applicable to the encounter."
      >
        {formData.encounterType === "admission" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormField
              label="Admission Date"
              name="admissionDate"
              type="date"
              value={formData.admissionDate}
              onChange={handleChange}
            />

            <FormField
              label="Discharge Date"
              name="dischargeDate"
              type="date"
              value={formData.dischargeDate}
              onChange={handleChange}
            />

            <FormField
              label="Hospital / Facility"
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
              placeholder="Enter hospital name"
            />

            <FormField
              label="Ward"
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              placeholder="Enter ward"
            />

            <FormField
              label="Bed"
              name="bed"
              value={formData.bed}
              onChange={handleChange}
              placeholder="Enter bed number"
            />
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            label="Consultant Name"
            name="consultant.name"
            value={formData.consultant.name}
            onChange={handleChange}
            placeholder="Enter consultant's name"
          />

          <FormField
            label="Consultant Specialty"
            name="consultant.specialty"
            value={formData.consultant.specialty}
            onChange={handleChange}
            placeholder="e.g. Internal Medicine"
          />
        </div>
      </Section>

      {/* SECTION 3: Patient measurements */}

      <Section
        title="3. Patient Measurements"
        description="Record measurements obtained during this encounter."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="height">
              Height
            </label>

            <div className="flex gap-2">
              <input
                id="height"
                name="height"
                type="number"
                min="0"
                step="any"
                value={formData.height}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 175"
              />

              <select
                name="heightUnit"
                value={formData.heightUnit}
                onChange={handleChange}
                className="rounded-md border border-gray-300 px-3"
                aria-label="Height unit"
              >
                <option value="cm">cm</option>
                <option value="m">m</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="weight">
              Weight
            </label>

            <div className="flex gap-2">
              <input
                id="weight"
                name="weight"
                type="number"
                min="0"
                step="any"
                value={formData.weight}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 70"
              />

              <select
                name="weightUnit"
                value={formData.weightUnit}
                onChange={handleChange}
                className="rounded-md border border-gray-300 px-3"
                aria-label="Weight unit"
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="lb">lb</option>
              </select>
            </div>
          </div>
        </div>
      </Section>

      {/* SECTION 4: Patient history */}

      <Section
        title="4. Subjective Assessment & Patient History"
        description="Document information reported by the patient or obtained from their history."
      >
        <div className="space-y-4">
          <TextAreaField
            label="Presenting Complaints"
            name="presentingComplaints"
            value={formData.presentingComplaints}
            onChange={handleChange}
            rows={4}
          />

          <FormField
            label="Complaint Duration"
            name="complaintDuration"
            value={formData.complaintDuration}
            onChange={handleChange}
            placeholder="e.g. 3 days, 2 weeks"
          />

          {/* <TextAreaField
            label="Past Medical History"
            name="pastMedicalHistoryNotes"
            value={formData.pastMedicalHistoryNotes}
            onChange={handleChange}
          />

          <TextAreaField
            label="Family History"
            name="familyHistoryNotes"
            value={formData.familyHistoryNotes}
            onChange={handleChange}
          />

          <TextAreaField
            label="Social History"
            name="socialHistoryNotes"
            value={formData.socialHistoryNotes}
            onChange={handleChange}
          /> */}

          <TextAreaField
            label="Medication Compliance / Adherence History"
            name="complianceHistory"
            value={formData.complianceHistory}
            onChange={handleChange}
          />

          {/* <TextAreaField
            label="Medication Allergy Notes"
            name="medicationAllergyNotes"
            value={formData.medicationAllergyNotes}
            onChange={handleChange}
          />

          <TextAreaField
            label="Herbal Medicine Use"
            name="herbalMedicineNotes"
            value={formData.herbalMedicineNotes}
            onChange={handleChange}
          /> */}

          <TextAreaField
            label="Current Medication-Related Complaints"
            name="currentMedicationComplaints"
            value={formData.currentMedicationComplaints}
            onChange={handleChange}
          />
        </div>
      </Section>

      {/* SECTION 5: Clinical assessment */}

      <Section
        title="5. Objective Findings & Clinical Assessment"
        description="Document observed findings and summarize the clinical assessment."
      >
        <div className="space-y-4">
          <TextAreaField
            label="Objective Findings"
            name="objectiveNotes"
            value={formData.objectiveNotes}
            onChange={handleChange}
            rows={5}
          />

          <TextAreaField
            label="Assessment Summary"
            name="assessmentSummary"
            value={formData.assessmentSummary}
            onChange={handleChange}
            rows={5}
          />
        </div>
      </Section>

      {/* FORM ACTIONS */}

      <div className="flex flex-wrap justify-end gap-3 border-t pt-5">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-md border border-gray-300 px-5 py-2.5 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving Encounter..." : "Save Encounter"}
        </button>
      </div>
    </form>
  );
}
