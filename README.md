
# MathTutor – AI-Powered Educational Mobile Application

MathTutor is a cross-platform mobile application designed to help high school students in 11th grade understand mathematical concepts in **Limits of Functions** through theory, interactive exercises, personalized feedback, and gamified learning. It integrates **AI explanations** using GPT-3.5 Turbo and stores user data securely in **Supabase**.

---

## Tech Stack

- **Front-end**: React Native (with Expo)
- **Back-end**: Flask (Python)
- **Database**: Supabase (PostgreSQL)
- **AI Engine**: OpenAI GPT-3.5 Turbo
- **Authentication**: Supabase Auth with back-end JWT
- **E2E Testing**: Maestro
- **Automated Testing**: Pytest (Flask), Jest (React Native)

---

## Features

- Unit-Based structure, where the content is structured into 3 units, divided into theory and practice with 5 exercise lessons/unit.
- Custom math exercises using polynomial as a base with AI-powered explanations
- “Explain My Mistake” feature using GPT-3.5 Turbo
- Point-based (XP) system, lives (hearts), and gamified lesson progression
- Authentication with Supabase (email, password)
- Progress tracking per unit and lesson
---

## Installation Guide

### Front-end Setup (React Native)

#### Prerequisites
- Node.js (>= 16)
- npm or yarn
- Expo CLI 

#### Install

```bash
cd frontend
npm install
# or
yarn install
````
> Ensure you have Node.js and Expo CLI (`npm install -g expo-cli`) installed globally.

### Back-end (Flask)

#### Prerequisites
- Python
- pip

#### Install

```bash
cd backend
python -m venv venv
source venv/bin/activate  # (Linux/macOS)
venv\Scripts\activate     # (Windows)
pip install -r requirements.txt
```
---

## Supabase Setup

### 1. Create a Supabase Account

* Go to: [https://supabase.com](https://supabase.com)
* Sign up with GitHub or email

### 2. Create Organization

* Name it (e.g., `MathTutorOrg`)
* Choose region (I believe Germany was the closest one - eu-central-1)

### 3. Create Project

* Name: `MathTutor`
* Password: a secure DB password
* Save the `Project URL` (from API Docs) and `service-role/secret` in the **.env file in the back-end** (in Project Settings -> API Keys)

### 4. Create `user` Table

Navigate to **Table Editor** and click **"Create Table"**:

* Table name: `user`
* Schema: `public`

| Column Name        | Type      | Properties                                |
| ------------------ | --------- | ----------------------------------------- |
| user_id            | int8      | Primary key, is unique and is identity    |
| name               | varchar   | null                                      |
| email              | varchar   | null                                      |
| hearts             | int2      | default: 5                                |
| xp                 | int2      | default: 0                                |
| current_lesson     | int2      | default: 1                                |
| current_unit       | int2      | default: 1                                |
| password_hash      | text      | null                                      |
| completed_lessons  | text      | '{}'::text[]                              |

> Leave RLS enabled on the `user` table.
---

## OpenAI GPT-3.5 Turbo Setup

### 1. Create an OpenAI Account

* Visit: [https://platform.openai.com](https://platform.openai.com)
* Sign up or log in

### 2. Set Up Billing

* Set up Organization to Personal and Projects to Default Project
* Click on profile → **Organization > Billing**
* Press **Add to credit balance** and put a value there
* Add a credit card under **Payment Methods**

### 3. Create API Key

* Go to **API-Keys**
* Click **Create new secret key**
* Name it (e.g., `MathTutorKey`)
* Copy it immediately and save it securely, leave all permissions
---

## Environment Variables

Create a `.env` file in your **back-end** project folder:

```
OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxxxx"
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_KEY="your-supabase-service-role-key"
JWT_SECRET="your_custom_jwt_secret"
```
---

## Project Structure

```
MathTutor/
├── frontend/                # React Native frontend
├── ├── app
  │   ├── context/             # AppContext with signin/signup, etc
  │   ├── (auth)/              # All auth screens
  │   ├── (tabs)/              # All tab screens 
  │   ├── exercises /          # All exercise screens 
  │   ├── api /                # API handlers
│   ├── components/            # Custom UI components
  │   ├── __mocks__ /          # Mocks for testing
  │   ├── __tests__ /          # Tests
│   ├── maestro/               # E2E Maestro flows
├── backend/                   # Flask backend
│   ├── app.py                 # Main entry point - Signup/Login logic and the rest
│   ├── exercises.py           # Generation of exercises
│   ├── ai.py                  # OpenAI integration
│   ├── fetch.py               # Fetch Data from JSON files
├── README.md
```

---

## Run the App

### Start Backend:

```bash
cd backend
flask run
# or
python app.py
# or run in the IDE normally (ex for Windows to run in VSCode: d:/backend/.venv/Scripts/python.exe d:/backend/app.py)
```

### Start Front-end:

```bash
cd frontend
npx expo start

# scan the code if you install the Expo Go App or, after loading, open the emulator in Android Studio and type

a

# Another way is to type this command instead of the previous to have it open in Android Studio or just open the emulator without the application

npm run android
```
> Ensure you have an Android SDK installed on the computer to run the project on an emulator. 
> To run the front-end with the back-end you need to change the **API_URL** in the handler files in the folder **api**.

---

## Testing

### Front-end:

> ensure that in **package.json** at the **jest** part you have the path where the project is for the setup jest file, otherwise the tests will not work/pass
    "setupFiles": [
      "D:/ReactProjects/frontend/jest.setup.js" 
      ]

```bash
npx jest
```

### Back-end:

```bash
pytest tests/test_app.py   
```

### E2E Testing (Maestro):

```bash
maestro test maestro/login_flow.yaml
```
---

## Notes
* Ensure CORS is enabled in your Flask backend.
---
