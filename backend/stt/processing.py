import os
from typing import Optional, List
from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel

# --- Pydantic Models (Schema) ---

class PatientInfo(BaseModel):
    patient_name: Optional[str] = None
    date_of_birth: Optional[str] = None
    age: Optional[str] = None
    sex: Optional[str] = None
    medical_record_number: Optional[str] = None
    date_of_clinic_visit: Optional[str] = None
    primary_care_provider: Optional[str] = None
    personal_note: Optional[str] = None

class PreviousHistory(BaseModel):
    past_medical_history: Optional[List[str]] = None
    past_surgical_history: Optional[List[str]] = None
    family_history: Optional[List[str]] = None
    social_history: Optional[str] = None

class ReviewOfSystems(BaseModel):
    positive_findings: Optional[List[str]] = None
    negative_findings: Optional[List[str]] = None

class VitalSigns(BaseModel):
    temperature: Optional[str] = None
    blood_pressure: Optional[str] = None
    heart_rate: Optional[str] = None
    respiratory_rate: Optional[str] = None
    oxygen_saturation: Optional[str] = None

class PhysicalExam(BaseModel):
    general_appearance: Optional[str] = None
    vital_signs: Optional[VitalSigns] = None
    examination_findings: Optional[str] = None

class ClinicalNote(BaseModel):
    patient_info: PatientInfo
    history_of_present_illness: Optional[str] = None
    allergies: Optional[List[str]] = None
    medications: Optional[List[str]] = None
    previous_history: PreviousHistory
    review_of_systems: ReviewOfSystems
    physical_exam: PhysicalExam
    assessment: Optional[str] = None
    icd10_codes: Optional[List[str]] = None
    plan: Optional[List[str]] = None
    medical_decision_making: Optional[str] = None


# --- Load Environment & Init Client ---
load_dotenv()
client = genai.Client()  # reads GEMINI_API_KEY from .env


# --- Core Functions ---

def build_prompt(transcript: str) -> str:
    """Build the Gemini extraction prompt."""
    return f"""
You are a medical scribe. Extract structured data from the transcript and return valid JSON strictly following the ClinicalNote schema.  

Instructions:
1. Patient Information: Always include the patient's **sex** in `patient_info`.  
   - If stated, record exactly as given.  
   - If not stated, infer logically if possible (e.g., from pronouns or names). Otherwise, set to "Not stated".  

2. Plan Section: The `plan` field must contain **clear, actionable medical suggestions**, not generic text.  
   - Include medications with names and dosages (if mentioned).  
   - Record diagnostic tests, referrals, or imaging orders.  
   - Add lifestyle or home-care recommendations if stated.  
   - Always include follow-up instructions if given.  

3. Accuracy:  
   - Preserve all clinical details exactly as stated in the transcript.  
   - Do not paraphrase or omit diagnoses, medications, or plans.  

4. Completeness:  
   - Every field in the schema must be present.  
   - Use `"Not stated"` for missing string fields and `[]` for missing list fields.  

5. Output:  
   - Return **only valid JSON** that conforms to the schema.  
   - Do not include explanations, notes, or extra text outside the JSON.  


Schema:
- patient_info:
    - patient_name: str
    - dob: str
    - age: str
    - sex: str
    - medical_record_number: str
    - date_of_clinic_visit: str
    - primary_care_provider: str
    - personal_note: str
- hpi: str
- allergies: list[str]
- medications: list[str]
- previous_history:
    - pmh: list[str]
    - psh: list[str]
    - fh: list[str]
    - sh: str
- ros:
    - positive: list[str]
    - negative: list[str]
- physical_exam:
    - general: str
    - vital_signs:
        - temperature: str
        - blood_pressure: str
        - heart_rate: str
        - respiratory_rate: str
        - oxygen_saturation: str
    - exam_findings: str
- assessment: str
- icd10_codes: list[str]
- plan: list[str]
- mdm: str

Transcript:
{transcript}
"""

def extract_clinical_note(transcript: str) -> ClinicalNote:
    """Send transcript to Gemini and return structured ClinicalNote."""
    prompt = build_prompt(transcript)
    resp = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": ClinicalNote,
        },
    )
    return resp.parsed  # returns ClinicalNote object


def print_note(note: ClinicalNote):
    """Pretty-print the extracted clinical note."""
    print(f"""Patient: {note.patient_info.patient_name or "Not stated"}   
Date of Birth: {note.patient_info.date_of_birth or "Not stated"}   
Age: {note.patient_info.age or "Not stated"}   
Sex: {note.patient_info.sex or "Not stated"}   
Medical Record #: {note.patient_info.medical_record_number or "Not stated"}   
Date of Clinic Visit: {note.patient_info.date_of_clinic_visit or "Not stated"}   
Primary Care Provider: {note.patient_info.primary_care_provider or "Not stated"}   
Personal Note: {note.patient_info.personal_note or "Not stated"}   

History of Present Illness (HPI)
{note.history_of_present_illness or "Not stated"}

Allergies: {", ".join(note.allergies or []) or "Not stated"}
Medications: {", ".join(note.medications or []) or "Not stated"}

Previous History
Past Medical History: {", ".join(note.previous_history.past_medical_history or []) or "Not stated"}
Past Surgical History: {", ".join(note.previous_history.past_surgical_history or []) or "Not stated"}
Family History: {", ".join(note.previous_history.family_history or []) or "Not stated"}
Social History: {note.previous_history.social_history or "Not stated"}

Review of Systems
Positive Findings: {", ".join(note.review_of_systems.positive_findings or []) or "Not stated"}
Negative Findings: {", ".join(note.review_of_systems.negative_findings or []) or "Not stated"}

Physical Exam
General Appearance: {note.physical_exam.general_appearance or "Not stated"}
Vital Signs: 
    Temperature: {note.physical_exam.vital_signs.temperature if note.physical_exam.vital_signs else "Not stated"}
    Blood Pressure: {note.physical_exam.vital_signs.blood_pressure if note.physical_exam.vital_signs else "Not stated"}
    Heart Rate: {note.physical_exam.vital_signs.heart_rate if note.physical_exam.vital_signs else "Not stated"}
    Respiratory Rate: {note.physical_exam.vital_signs.respiratory_rate if note.physical_exam.vital_signs else "Not stated"}
    Oxygen Saturation: {note.physical_exam.vital_signs.oxygen_saturation if note.physical_exam.vital_signs else "Not stated"}
Examination Findings: {note.physical_exam.examination_findings or "Not stated"}

Assessment
{note.assessment or "Not stated"}
ICD-10 Codes: {", ".join(note.icd10_codes or []) or "Not stated"}

Plan
{chr(10).join(f"- {p}" for p in (note.plan or [])) or "Not stated"}

Medical Decision Making (MDM)
{note.medical_decision_making or "Not stated"}
""")


# --- Main Entrypoint ---
if __name__ == "__main__":
    # Replace this with reading from file/stdin if needed
    transcript = """... your transcript text here ..."""

    note = extract_clinical_note(transcript)
    print_note(note)
