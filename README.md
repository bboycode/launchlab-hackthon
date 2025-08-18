# LaunchLab Hackathon Project – Voice2Vitals

## 📌 Problem  
Clinicians are drowning in paperwork, not patient care.  
- Estimated **2–5 hours per day** wasted on administrative tasks  
- Leads to **physician burnout** and compromised patient experience  
- Causes significant **revenue loss** for hospitals  

**The Challenge:**  
How can we liberate clinicians from the keyboard and let them focus on patients?  

---

## 🎯 Objective  
Develop a solution to **automatically convert spoken clinical conversations into accurate, structured clinical notes**.  

By reducing admin burden for clinicians, we unlock:  
- Faster clinical workflows  
- Improved physician well-being  
- Better patient experience  
- Increased healthcare efficiency  

---

## 💡 Our Solution  
We created a **web application** that enables doctors to:  

-  **Register & Log In** securely  
-  **Manage Patients** — view and add patient profiles from a central dashboard  
-  **Record Consultations** — upload pre-recorded audio files of patient consultations  
-  **AI-Powered Transcription & Structuring**  
  - Convert speech to text using **Rev.ai**  
  - Transform transcripts into **structured clinical notes** using **Gemini**  
-  **Editable Notes** — clinicians can refine notes to correct any AI inaccuracies  
-  **Virtual Assistant – Dr. Vital**  
  - Quickly surfaces relevant patient information  
  - Provides an interactive way to reduce time searching through records  

---

## ✨ Features  
-  Secure doctor registration & login  
-  Patient dashboard with searchable table view  
-  Register new patients easily  
-  Upload audio consultations for transcription  
-  AI-generated structured clinical notes  
-  Editable notes to ensure accuracy  
-  Virtual assistant (Dr. Vital) for quick patient insights  

---

## ⚙️ Tech Stack  
- **Frontend**: React (TypeScript, TailwindCSS)  
- **Backend**: Python (Flask)  
- **Database & Auth**: Supabase  
- **AI/ML**: Rev.ai (speech-to-text) + Gemini (structured notes)   

---

## 📸 Screenshots 

1. **Doctor Login**
   <img width="1833" height="958" alt="image" src="https://github.com/user-attachments/assets/701569cd-ea8a-4f9d-9afd-f0569e0e6218" />

2. **Doctor Registration**
   <img width="1836" height="961" alt="image" src="https://github.com/user-attachments/assets/4ef4b73b-0cc5-4460-b450-815a8463b24a" />

3. **Doctor Dashboard**
   <img width="1836" height="961" alt="image" src="https://github.com/user-attachments/assets/d7badf10-f3a3-4fcd-b81d-1d3687967afc" />
   
4. **Patient Registration**
   <img width="1853" height="980" alt="image" src="https://github.com/user-attachments/assets/9e8185c9-89e5-43e6-9013-52ab7f17c571" />

5. **Audio Upload**
   <img width="1835" height="960" alt="image" src="https://github.com/user-attachments/assets/ee446f15-0f5a-4251-b71e-2b1d8d60ee64" />

6. **Generated Clinical Notes**
   *General Patient information*
   <img width="1831" height="957" alt="image" src="https://github.com/user-attachments/assets/6a97e8bd-f032-4995-ae18-5ebe9f05f541" />
   *Structured CLinical Notes*
   <img width="1833" height="859" alt="image" src="https://github.com/user-attachments/assets/ae2281ce-8fdd-4be4-8fd2-f2eea0fbd9bf" />
   *Editing clinical notes*
   <img width="1819" height="743" alt="image" src="https://github.com/user-attachments/assets/8f1f8568-7317-40a1-ba24-b2e075dfb838" />

7. **Dr. Vital Assistant** 
   <img width="1835" height="965" alt="image" src="https://github.com/user-attachments/assets/14663cb9-21c8-4787-9ae4-5290bd9cb002" />

---

## 🚀 How to Run

**Backend Setup and Run**
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate    # On Linux/Mac
venv\Scripts\activate       # On Windows

# Install dependencies
pip install -r requirements.txt

# Run backend server
python3 stt/main.py
```
**Frontend Setup and Run**
```bash
cd Front/voice2vital

# Install dependencies
npm install

# Run development server
npm run dev
```

---
