# AI Friend Finder

AI Friend Finder is a MERN‑stack web application that uses AI‑based matching to help users discover compatible friends based on interests, lifestyle, and location.

---

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
  - [Profile Overview](#profile-overview)
  - [Edit Profile Sections](#edit-profile-sections)
  - [Discovery Page](#discovery-page)
  - [Friend Finder Swiping](#friend-finder-swiping)
  - [Friend Details](#friend-details)
  - [Compatibility Breakdown](#compatibility-breakdown)
- [AI Matching Logic](#ai-matching-logic)
- [Future Improvements](#future-improvements)
- [How to View Screenshots on GitHub](#how-to-view-screenshots-on-github)

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

- **Frontend:** React (Vite / CRA), HTML5, CSS / Tailwind (adapt to your actual setup).
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

