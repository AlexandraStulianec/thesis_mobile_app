
# MathTutor – AI-Powered Educational Mobile App

MathTutor is a cross-platform mobile app designed to help high school students master mathematical concepts like **Limits of Functions** through theory, interactive exercises, personalized feedback, and gamified learning. It integrates **AI explanations** using GPT-3.5 Turbo and stores user data securely in **Supabase**.

---

## Tech Stack

- **Frontend**: React Native (with Expo)
- **Backend**: Flask (Python)
- **Database**: Supabase (PostgreSQL)
- **AI Engine**: OpenAI GPT-3.5 Turbo
- **Authentication**: Supabase Auth with JWT
- **E2E Testing**: Maestro
- **Unit Testing**: Pytest (Flask), Jest (React Native)

---

## 🚀 Features

- Custom math exercises with AI-powered explanations
- “Explain My Mistake” feature using GPT-3.5 Turbo
- XP system, lives (hearts), and gamified lesson progression
- Authentication with Supabase (email, password)
- Progress tracking per unit and lesson

---

## Installation Guide

### Front-end (React Native)

```bash
git clone
cd frontend
npm install
npx expo start
````

> Ensure you have Node.js and Expo CLI installed globally.

### Back-end (Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py / run in the IDE normally
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
* Save the `Project URL` (from API Docs) and `anon/public` in the **.env file in the back-end** ( in Project Settings -> API Keys

### 4. Create `users` Table

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


> Leave RLS enabled on the `users` table.

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
  │   ├── exercises /          # All exercises screens 
  │   ├── api /              # API handlers
│   ├── components/          # Custom UI components
  │   ├── __mocks__ /        # Mocks for testing
  │   ├── __tests__ /        # Tests
│   ├── maestro/             # E2E Maestro flows
├── backend/                 # Flask backend
│   ├── app.py               # Main entry point
│   ├── auth.py              # Signup/Login logic
│   ├── ai.py                # OpenAI integration
│   ├── database_handler.py  # Supabase DB logic
├── README.md
```

---

## Run the App

### Start Backend:

```bash
cd backend
flask run
```

### Start Front-end:

```bash
cd frontend
npx expo start

--- scan the code if you install the Expo Go App or after loading open the emulator in Android Studio and type

a

--- or write

npm run android

(! be sure to have an Android SDK installed on the computer to run the project on an emulator) 
```

---

## Testing

### Front-end:

ensure that in package.json at this part you have the path where the project is
"jest": {
    "preset": "jest-expo",
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
