# LearnWise

LearnWise is an AI-powered personalized learning platform that generates structured learning roadmaps based on a user's existing skills, interests, and career goals. Built using the MERN stack and powered by LLaMA (via Ollama), the platform helps learners discover relevant topics, access curated learning resources, and track their progress through an organized learning journey.

## Features

* AI-generated personalized learning roadmaps
* Skill and goal-based topic recommendations
* Curated learning resources for each topic
* Progress tracking and completion status
* Secure user authentication and authorization
* Admin dashboard for managing users and learning resources

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

## Future Enhancements

* AI-powered chatbot for learning assistance
* Interactive quizzes and assessments
* Learning progress analytics
* Certificate generation after roadmap completion

## Team

This project was developed collaboratively by:

- Jemsheera Basheer Kunju 
- Reeha Fathima
- Sheza P 
- Abhinandana C P
## Overview

LearnWise simplifies the process of finding and organizing learning resources by providing a structured, AI-generated roadmap. It reduces time spent on searching and helps users focus on guided, goal-oriented learning.
