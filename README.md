# AI Friend Finder

AI Friend Finder is a MERN‑stack web application that uses AI‑based matching to help users discover compatible friends based on interests, lifestyle, and location.

---
- [Screens and User Flows](#screens-and-user-flows) Click Here to see the project screenshots



## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Overview](#system-overview)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Screens and User Flows](#screens-and-user-flows)
  - [Sign Up](#sign-up)
  - [Sign In](#sign-in)
  - [Dashboard](#dashboard)
  - [Discovery Page](#discovery-page)
  - [Friend Finder Swiping](#friend-finder-swiping)
  - [Friend Details](#friend-details)
  - [Compatibility Breakdown](#compatibility-breakdown)
  - [Profile Overview](#profile-overview)
  - [Edit Profile Sections](#edit-profile-sections)
- [AI Matching Logic](#ai-matching-logic)
- [Future Improvements](#future-improvements)

---

## Features

- User registration and login with email and password.
- Multi‑section user profile:
  - Basic information, contact details, professional info.
  - Lifestyle choices, interests, and personal preferences.
  - Privacy, security, notification, and account settings.
- AI Friend Finder module with:
  - Swipe‑style friend discovery cards.
  - Detailed profile pop‑up for each potential friend.
  - Compatibility score with breakdown (interest, age, location, etc.).
- Clean, responsive UI with clear sections so that non‑technical users can easily navigate.

---

## Tech Stack

- **Frontend:** React (Vite) , HTML5, CSS .
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose for ORM).
- **Architecture:** MVC pattern with separate layers for models, controllers, and services.

---

## System Overview

The application is divided into three main modules:

1. **Authentication Module**  
   Handles sign up, sign in, and session management using JSON Web Tokens (JWT).

2. **Profile & Preferences Module**  
   Stores the user’s personal data, lifestyle, interests, and privacy settings.  
   This module is the main data source for the matching algorithm.

3. **AI Matching & Discovery Module**  
   Uses profile data to calculate compatibility scores and suggest friends.  
   Powers the Friend Finder page, swipe cards, and compatibility analytics.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local instance or cloud, e.g., MongoDB Atlas)
- Git

### Installation

1. Clone the repository
  git clone https://github.com/<your-username>/ai-friend-finder.git
  cd ai-friend-finder

2. Install backend dependencies
  cd server
  npm install

3. Install frontend dependencies
  cd ../client
  npm install

### Environment Variables

Create a `.env` file inside the `server` directory:
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>
PORT=5000

### Running the Application

Start backend (from /server)
  npm run dev

Start frontend (from /client, in a second terminal)
  npm run dev



Open your browser at: `http://localhost:3000`

---

## Project Structure

ai-friend-finder/
client/
src/
components/
pages/
services/
styles/
server/
controllers/
models/
routes/
services/
utils/

- `models/` defines MongoDB schemas for users, profiles, and matches.
- `controllers/` handles HTTP request logic.
- `services/` contains business logic such as the matching functions.

---

## Screens and User Flows

All screenshots are placed inside the `/screenshots` folder in the root.
### Sign Up

![Screenshot 2Signup Page](screenshots/Screenshot%202Signup%20Page.png)

The **Join AI Friend Finder** page lets new users create an account.

- Fields: first name, last name, email, age, location, password, and confirm password.
- Users can upload up to **5 profile images** before creating an account.
- After clicking **Create Account**, the backend validates the input and stores the user.

---

### Sign In

![Screenshot 2025-12-05 172730](screenshots/Screenshot%202025-12-05%20172730.png)

The sign in screen welcomes returning users.

- Inputs for email and password.
- **Sign In** button triggers authentication.
- If valid, the user is redirected to the dashboard.
- A link at the bottom takes users to the sign‑up page if they do not have an account.

---

### Dashboard

![Screenshot dashboard](screenshots/Screenshot%20dashboard.png)

The **AI Friend Finder Dashboard** is the main hub.

- **Your Profile** – open and complete your profile for better matches.
- **AI Matches** – start discovering compatible friends using AI.
- **Compatibility Analytics** – reserved for more advanced stats (coming soon).
- The footer indicates that the project is built with the MERN stack and MVC architecture.

---
### Discovery Page

![Screenshot discover](screenshots/Screenshot%20discover.png)

The **Discover Your Perfect Friends** page introduces AI‑powered discovery tools.

- **Find People Nearby:** discover users in your area.
- **AI Personality Match:** match based on traits and interests.
- **Local Events & Activities:** find meetups and events.
- **Interest Groups:** join groups based on shared hobbies.
- **Explore New Interests:** discover new hobbies.
- **Friendship Events:** curated events for making friends.

A **Start Finding Friends** button takes the user into the actual friend finder.

---

### Friend Finder Swiping

![Screenshot Compatibility page](screenshots/Screenshot%20Compatibility%20page.png)

The main friend finder page displays swipeable cards.

- Title: “Discover Your Perfect Friend”.
- The app shows top AI‑matched results with a compatibility percentage.
- Each card displays:
  - Profile image.
  - Name and age.
  - Location.
  - About me text.
  - Occupation.
  - Interests.
  - “Things I Love”.
  - A **compatibility bar** with percentage.
- Buttons:
  - **Red X** – pass (skip this profile).
  - **Green Heart** – like (send interest).
  - **View More Details** – open full profile modal.

---

### Friend Details

![Screenshot Friend finder Details 1](screenshots/Screenshot%20Friend%20finder%20Details%201.png)

The detailed profile modal of a potential friend includes:

- Name, age, and location at the top.
- Overall compatibility percentage.
- Short summary of:
  - Location.
  - Profession.
  - Education.
  - Match score.
- “About” section with a short self‑description.
- Button to **Connect** with the user.

![Screenshot friend finder details 2](screenshots/Screenshot%20friend%20finder%20details%202.png)

The extended view shows:

- **Interests & Passions:** colored tags for hobbies (e.g., movies, board games, cooking, language learning).
- **Favorites:** things they love (e.g., Pitha‑Puli, rainy days, Rabindra Sangeet) and “Not My Thing” tags (e.g., traffic jam, crowded places).
- **Why You’re Compatible:** cards that break down:
  - Interest similarity.
  - Location proximity.
  - Age compatibility.
  - Occupation alignment.
  - Bio similarity.

---

##Friend Finder Dashboard
![Screenshot Friend Finder Page](screenshots/Screenshot%20Friend%20Finder%20Page.png)


### Profile Overview

![Screenshot Profile 1](screenshots/Screenshot%20Profile%201.png)

The profile page shows a quick summary of the user.

- Displays name, age, location, and online status.
- A progress bar (for example, **62% complete**) motivates users to fill all sections.
- Tabs at the top:
  - **Basic Info**
  - **Lifestyle**
  - **Preferences**
  - **Privacy & Security**
  - **Notifications**
  - **Account**

---

### Edit Profile Sections

#### Basic Info Edit

![Edit Section](screenshots/Edit%20Section.png)

Users can edit core profile fields:

- **Personal Information:** first name, last name, age.
- **Contact Information:** email address and location.
- **Professional Information:** occupation and education.
- **Physical Information:** height and body type.
- **About Me:** short bio (for example, “I want Friends”).

Each group is separated into clear cards to make editing simple.

---

#### Lifestyle Tab

![Screenshot profile 2](screenshots/Screenshot%20profile%202.png)

The lifestyle section lets users define how they live.

- Smoking habits (e.g., Never).
- Drinking habits (e.g., Socially).
- “Looking For” field (type of connection).
- Communication style (how they like to talk).
- Family & Pets (children or pets information).

---

#### Preferences Tab

![Screenshot Profile 3](screenshots/Screenshot%20Profile%203.png)

The preferences section controls how the AI understands the user’s likes.

- **Things I Love (max 4)** – key favorites the user really enjoys.
- **Not My Thing (max 4)** – things they want to avoid.
- Sliders for:
  - **Work‑Life Balance:** work‑focused ↔ balanced ↔ life‑focused.
  - **Social Engagement:** introvert ↔ balanced ↔ extrovert.

---

#### Privacy & Security Tab

![Screenshot Profile 4](screenshots/Screenshot%20Profile%204.png)

Users can adjust how visible and secure their account is.

- Toggle for **Two‑Factor Authentication** (if implemented).
- **Privacy Settings**:
  - Show online status.
  - Allow message requests.
  - Show last seen.
  - Discoverable by email or phone.

---

#### Notifications Tab

![Screenshot Profile 5](screenshots/Screenshot%20Profile%205.png)

Notification preferences define what alerts a user receives.

- Toggles for:
  - New matches.
  - New messages.
  - Profile views.
  - Friend requests.
  - Events and marketing communications.

---

#### Account Tab

![Screenshot Profile 6](screenshots/Screenshot%20Profile%206.png)

The account tab summarizes account‑level information.

- **Account Status:** e.g., Active.
- **Verification Status:** e.g., Not Verified.
- Area for future features like account deactivation or verification management.

---

## AI Matching Logic

The compatibility score is computed by combining several factors:

- **Interest Similarity:** compares overlapping interests and “Things I Love”.
- **Location Proximity:** checks whether users share the same city or are geographically close.
- **Age Compatibility:** rewards small age differences and penalizes large gaps.
- **Occupation Alignment:** checks for similar roles or study areas.
- **Bio Similarity:** basic text similarity on the “About Me” fields (e.g., using keyword overlap or cosine similarity on embeddings).

A weighted formula then converts these components into a single percentage that is displayed on both the swipe card and the details page.

---

## Future Improvements

- Real‑time chat between matched friends.
- More advanced personality tests and trait‑based matching.
- Event recommendation system integrated with external APIs.
- Better compatibility analytics and visual charts.
- Mobile‑first responsive refinements and PWA support.

---


