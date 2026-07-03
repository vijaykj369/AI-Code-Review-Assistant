# AI Code Review Assistant

## 🚀 Overview

AI Code Review Assistant is a full-stack web application that leverages Artificial Intelligence to perform automated code reviews and GitHub repository analysis. The platform helps developers identify bugs, security vulnerabilities, performance issues, code smells, and best-practice violations across multiple programming languages.

Users can either paste source code directly into the editor or provide a GitHub repository URL for comprehensive repository-level analysis. The application maintains review history and provides dashboard analytics for both code reviews and repository reviews.

---

## ✨ Features

### 🔍 AI-Powered Code Review

* Analyze pasted source code using AI.
* Detect bugs and potential vulnerabilities.
* Suggest performance optimizations.
* Recommend coding best practices.
* Generate detailed review reports.

### 📂 GitHub Repository Review

* Paste a GitHub repository URL.
* Fetch and analyze repository files.
* Display repository file structure.
* Generate AI-powered repository review reports.

### 📊 Dashboard Analytics

* Total code reviews count.
* Total repository reviews count.
* Success/failure review statistics.
* Recent review activity.
* Review status monitoring.

### 🔐 Authentication

* User registration and login.
* JWT-based authentication.
* Protected routes and user sessions.

### 🌐 Multi-Language Support

The application supports reviewing code written in:

* JavaScript
* TypeScript
* C
* C++
* Java
* Python
* Go
* Rust
* Ruby
* PHP

---

## 🛠️ Technology Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Monaco Editor
* React Router
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

### External APIs

* OpenAI API
* GitHub API

---

## 📁 Project Structure

```text
ai-code-review-assistant/
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── auth/
│   │   │   ├── editor/
│   │   │   ├── review/
│   │   │   └── repo/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
├── docs/
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/ai-code-review-assistant.git
cd ai-code-review-assistant
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

```bash
cd ../server
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `server` directory:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret_key

OPENAI_API_KEY=your_openai_api_key

GITHUB_TOKEN=your_github_personal_access_token
```

---

## ▶️ Running the Project

### Start Backend

```bash
cd server
npm run dev
```

Backend server:

```text
http://localhost:5000
```

### Start Frontend

```bash
cd client
npm run dev
```

Frontend application:

```text
http://localhost:5173
```

---

## 🔄 Application Workflow

### Code Review Workflow

1. User logs in.
2. User selects a programming language.
3. User pastes source code.
4. Backend sends code to the AI service.
5. AI analyzes:

   * Bugs
   * Security issues
   * Performance problems
   * Code quality
   * Best practices
6. Results are stored and displayed.

### Repository Review Workflow

1. User pastes a GitHub repository URL.
2. Repository files are fetched using GitHub API.
3. File tree is displayed.
4. AI analyzes repository structure and source files.
5. Review results are generated and stored.

---

## 📊 Dashboard Features

The dashboard displays:

* Total code reviews performed
* Total repository reviews performed
* Successful reviews
* Failed reviews
* Recent activity history
* Review status statistics
* GitHub repository review submissions

---

## 🔒 Security Features

* JWT Authentication
* Password hashing using bcrypt
* API rate limiting
* Protected routes
* Error handling middleware
* Environment variable protection

---

## 🚀 Future Enhancements

* Pull Request Review Support
* CI/CD Integration
* Team Collaboration Features
* AI Chat Assistant
* Review Score System
* PDF Report Generation
* Repository Health Dashboard
* Real-Time Notifications

---
Demo Mode:
The current implementation uses simulated AI responses due to API quota limitations.
The architecture supports seamless integration with OpenAI, Gemini, Claude, or local LLMs.

## 👨‍💻 Author

**Vijay K J**

* Email: [vijaykj04@gmail.com](mailto:vijaykj04@gmail.com)
* Location: Karnataka, India

---

## 📄 License

This project is developed for educational, research, and portfolio purposes.
