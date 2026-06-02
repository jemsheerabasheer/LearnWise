# LearnWise

LearnWise is a web-based personalized learning platform designed to help users follow structured and efficient learning paths. It generates AI-based learning roadmaps tailored to an individual’s skills, interests, and career goals.

## Features

* Personalized learning roadmap generation
* Resource recommendations based on user input
* Progress tracking for completed topics
* User authentication system
* Admin dashboard for managing users and resources

## Technology Stack

* MongoDB
* Express.js
* React.js (Vite)
* Node.js
* LLaMA (via Ollama)

## Project Structure

* frontend/ – React application (user interface)
* backend/ – Node.js and Express API

## Prerequisites

Before running the project, ensure you have:

- Node.js (v18 or later)
- MongoDB installed or a MongoDB Atlas account
- Ollama installed and running locally

## Setup Instructions

1. Clone the repository
   git clone https://github.com/jemsheerabasheer/LearnWise.git

2. Install dependencies
   cd frontend
   npm install

   cd ../backend
   npm install

3. Run the application
   Frontend: npm run dev
   Backend: npm start

## Environment Variables

Create a `.env` file inside the backend directory and add:

PORT=5000
MONGO_URI=your_database_connection_string

## Team

This project was developed collaboratively by:

- Jemsheera Basheer Kunju 
- Reeha Fathima
- Sheza P 
- Abhinandana C P
## Overview

LearnWise simplifies the process of finding and organizing learning resources by providing a structured, AI-generated roadmap. It reduces time spent on searching and helps users focus on guided, goal-oriented learning.
