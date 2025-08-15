import os
from google import genai
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional, List

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


# transcript (unchanged)
transcript = """Doctor: Hi, Mr. and Mrs. Thompson, it’s good to see you both. How’s everyone doing? And Eli—he’s so little! I remember you mentioning your family’s bakery. Have you managed to spend any time baking cookies with your daughter since Eli arrived?

Other: Hi, Dr. Patel. We’re, um, hanging in there, thank you. It’s definitely been a lot with a newborn, but our daughter and I did squeeze in a batch last weekend.

Doctor: That’s wonderful to hear. Baking with family is always special. So, just to confirm, we have Eli Thompson here today, he’s three weeks old, and you’ve brought him in because you’ve noticed some issues with his eyes. Could you tell me— in your own words—what you’ve observed?

Other: Yes, so, um…we first noticed Eli’s right eye looked bigger than his left I think…no, wait, actually, both eyes looked a bit large, but the right one more so. And then there’s been watering—tearing—from both eyes, kind of all the time.

Doctor: I see. So, just to clarify, the tearing happens constantly, not just when he cries or anything, correct?

Other: That’s right. It’s pretty much all the time, not just with crying.

Doctor: Thanks, that helps. Has he shown any signs of discomfort—like keeping his eyes closed, being extra fussy, or rubbing at his eyes, maybe?

Other: No, not really. He fusses occasionally, but not more than we’d expect for a newborn. He doesn’t really rub his eyes…but then again, he’s still little, so I’m not sure he would anyway.

Doctor: Absolutely, that’s a fair point. Has Eli had any trouble feeding, fever, or breathing issues?

Other: No, none of that. He eats well and seems healthy otherwise.

Doctor: That’s good to hear. Just so I understand—Eli was born full-term with a vaginal delivery, correct? No complications during, uh, pregnancy or childbirth?

Other: Right, full-term, no, uh—well, there was, um, a little bit of a delay at delivery, but nothing we were told was serious.

Doctor: Okay, thank you for sharing that. Does anyone in your family—or in your partner's family—have similar eye conditions, or history of surgery or vision problems as a baby?

Other: No, not that we’re aware of. No eye diseases that we know of.

Doctor: Okay. Has Eli ever had any procedures or taken any medications since birth?

Other: Nope, no procedures, no medicines.

Doctor: Any allergies that you know of, or reactions to anything?

Other: None that we know of—he’s so young.

Doctor: Perfect, thank you. Now, I’m going to focus on Eli’s eyes for a careful examination. I’ll talk you through each part as I do it.

Doctor: I’m using a penlight now to look at both of Eli’s eyes. I can see corneal enlargement—the clear front part of both eyes is larger than normal, and it’s more obvious on the right. That enlargement is called buphthalmos. Now I’m very gently feeling the firmness of each eyeball, which checks the intraocular pressure; both feel more firm than I’d expect for a baby this age, which suggests the pressure inside the eyes is elevated.

Doctor: Next, I’m going to use the ophthalmoscope to look at the very back of Eli’s eyes. I’m focusing on the optic nerve, which connects the eye to the brain. On both sides, I’m seeing changes called cupping—this means the nerve is being damaged by the increased eye pressure.

Doctor: Thank you for letting me do this careful exam. I know it can be stressful to watch Eli get examined so closely.

Other: Is…is it something serious? What does all that mean?

Doctor: You know, these findings do point to something called congenital glaucoma, which means Eli was likely born with higher pressure in his eyes. Based on what we see, it’s almost certainly affecting both eyes, and might be partly due to a birth-related injury as well. The pressure inside his eyes is much higher than it should be, and over time, if left untreated, this could cause vision loss. The changes I saw in his optic nerves suggest that the pressure may already be causing some damage, but we’ve caught this early, which is really important.

Other: But…so, what do we do? Can it be fixed?

Doctor: That’s a really important question, and I want to reassure you—there are treatments available. The first thing we’ll do is start a pressure-lowering eye drop called Timolol. It’s a beta-blocker that’s safe in infants when used carefully. We’ll start with Timolol 0.5% eye drops, one drop in each eye twice a day. This will start reducing the pressure immediately while we get more information.

Other: Sorry to interrupt, but—they’re just eye drops? That’s all for now?

Doctor: Yes, for now, but this is just the first step. Glaucoma in babies usually needs a combination of medications and sometimes surgery to permanently fix the pressure problem. The drops are to help right away, but we also need to see exactly what's happening inside Eli’s eyes. So, we’re ordering an ocular ultrasound—it’s a scan that looks at the structure of the eyes in detail. And—I want to emphasize—Eli needs to see a pediatric eye specialist, an ophthalmologist, urgently. They have advanced tools and will tailor the next steps, including whether surgery is necessary.

Other: When will all that happen? I mean—the specialist, the ultrasound—how soon?

Doctor: The referral is marked as urgent, so we’ll arrange the specialist visit as soon as possible, likely within a few days. The ultrasound can be done here before your next visit or possibly at the ophthalmologist’s office. The main thing is to start the drops today.

Other: Do we need to stop anything or watch for specific side effects with the drops?

Doctor: That’s a great question. With Timolol, main side effects to watch are slow heart rate or breathing; sometimes babies can be extra fussy or feed less. If you notice any trouble breathing, color change, unusual sleepiness, or if Eli refuses to eat, call us or go to the emergency room immediately. Don’t stop the drops unless directed—just call if you have concerns.

Other: Uh—how long will this go on for? Will Eli be okay long term?

Doctor: That’s, understandably, a big worry. With treatment, many babies do very well, especially if caught early. Sometimes further treatment or surgery is needed, and ongoing eye monitoring will be part of Eli’s routine. I know it all sounds overwhelming, but we work with excellent pediatric eye teams, and you’re not alone in this.

Other: Thank you…so much. Sorry, just to check, we’ll start the drops, get the ultrasound, and then see the specialist? Did I get that right?

Doctor: Exactly right. I’ll have our nurse show you how to give the drops today. I’ll call you in two days to check in, but call us sooner if you’re worried about anything—especially Eli’s breathing or feeding. After the specialist sees him, we’ll work together on next steps, whether that’s more medication, surgery, or both.

Other: Okay…um, one more thing. Can he still, you know, be around the bakery when we’re working, or should we keep him away from anything specific?

Doctor: Totally understandable question. He can absolutely be around your family and the bakery—just make sure the environment is clean, and practice careful handwashing before giving his drops or touching around his eyes. No need to isolate him otherwise.

Other: Thank you, Dr. Patel. I think that’s all for now.

Doctor: You’re very welcome. I’ll see you again soon, and don’t hesitate to call with any questions before then. We’ll get through this together.
"""

# Load env
load_dotenv()

print(os.getenv("GEMINI_API_KEY"))
client = genai.Client()  # reads GEMINI_API_KEY from env

# Let's create the clinical note template as a .txt file

prompt1 = f"""
You are a medical scribe. Extract structured data from the transcript and return valid JSON matching the ClinicalNote schema below.

Rules:
1. Use only explicit information from the transcript unless a value can be logically derived (e.g., calculate "age" from DOB and date of clinic visit).
2. If a field is missing in the transcript, set it to:
   - "Not stated" for string fields
   - [] for list fields
3. Preserve all clinical details exactly as stated. Do not paraphrase diagnoses, medications, or plans.
4. Fill **every** field in the schema, even if it requires inference from other fields (e.g., calculate age from DOB).
5. For "vital signs", output the exact units given in the transcript.
6. For "ICD-10 codes", include them if explicitly stated or can be clearly identified from the diagnosis.
7. Use full medical terminology when available.
8. Do not include explanatory text — output JSON only.

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
prompt = (
    prompt1
)

# Gemini request
resp = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=prompt,
    config={
        "response_mime_type": "application/json",
        "response_schema": ClinicalNote,
    },
)

note: ClinicalNote = resp.parsed  # typed instance from your schema

# Print formatted note with full field names
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

