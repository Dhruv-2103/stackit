# 🚀 StackIT – The Minimal Q&A Platform for Modern Learners  
*A project proudly built for the Odoo Hackathon 2025*

[![Watch Demo](https://img.youtube.com/vi/F_169x9_Ar4/0.jpg)](https://www.youtube.com/watch?v=F_169x9_Ar4)

> 🎥 **Watch our Hackathon Demo Video** — click the thumbnail above or [watch on YouTube](https://www.youtube.com/watch?v=F_169x9_Ar4)

Welcome to **StackIT** — your clean, community-driven hub for asking questions, sharing answers, and growing together.  
No clutter, no distractions, just the joy of collaborative learning.  
Inspired by the best of Stack Overflow, built for communities who want less noise and more knowledge.

---

## 🙋 Why StackIT?

Tired of overwhelming forums and cluttered Q&A platforms?  
**StackIT** is here to offer:

- 🧘‍♂️ **A calm, intuitive interface** for focused learning  
- 🎯 **Core features only** — no bloat, just powerful Q&A  
- 🤝 **Real community engagement** with voting, tags, and real-time alerts  

Whether you're a student, developer, or lifelong learner, StackIT helps you find and share answers — faster.

> 🏁 Built with collaboration, open-source spirit, and a love for clean UX — **for the Odoo Hackathon**.

---

## 🌟 Core Features

|  |  |
|---|---|
| 🔐 **User Roles** | Guest (view only), User (post, vote, notify), Admin (moderate, ban, export) |
| 📝 **Ask Anything** | Create questions with rich formatting, titles, and multi-tag selection |
| 💬 **Answer & Discuss** | Respond using a beautiful rich text editor |
| 👍 **Voting & Acceptance** | Upvote/downvote answers, mark the best as accepted |
| 🏷️ **Tags** | Organize with relevant tech and topic tags (e.g., React, MongoDB) |
| 🔔 **Real-Time Notifications** | Get instant alerts for answers, comments, mentions & more |
| 🧰 **Admin Toolbox** | Moderate content, ban users, announce updates, export reports |

---

## 🖼️ UI & Experience

- [🖼️ Main UI Mockup](https://link.excalidraw.com/l/65VNwvy7c4X/8bM86GXnnUN)  
- [🔔 Notification System Mockup](https://link.excalidraw.com/l/65VNwvy7c4X/9mhEahV0MQg)

---

## 💻 Tech Stack

| Layer         | Tech                                   |
|---------------|----------------------------------------|
| **Frontend**  | React.js, React Router, Axios          |
| **UI**        | Tailwind CSS / Material UI             |
| **Rich Text** | TinyMCE Editor                         |
| **Backend**   | Node.js, Express.js                    |
| **Database**  | MongoDB, Mongoose                      |
| **Auth**      | JSON Web Tokens (JWT)                  |
| **Uploads**   | Multer / Cloudinary                    |
| **Cache**     | Redis (optional for development)       |
| **Versioning**| Git & GitHub                           |

---

## 👨‍💻 Meet the Team – Bit Coders  
*Hackathon Team, Odoo Hackathon 2025*

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/pratham4434">
        <img src="https://avatars.githubusercontent.com/u/100030051?v=4" width="80"/><br/>
        <b>Pratham Sharma</b>
      </a><br/>
      <a href="mailto:sharmapratham208@gmail.com">sharmapratham208@gmail.com</a>
    </td>
    <td align="center">
      <a href="https://github.com/Dhruv-2103">
        <img src="https://avatars.githubusercontent.com/u/103915592?v=4" width="80"/><br/>
        <b>Dhruv Shah</b>
      </a><br/>
      <a href="mailto:dhruv210shah@gmail.com">dhruv210shah@gmail.com</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/121177570?v=4" width="80"/><br/>
      <b>Mohib Ali Solanki</b><br/>
      <a href="mailto:mohibsolanki@gmail.com">mohibsolanki@gmail.com</a>
    </td>
    <td align="center">
      <a href="https://github.com/Dhruv-Mali">
        <img src="https://avatars.githubusercontent.com/u/109059409?v=4" width="80"/><br/>
        <b>Dhruv Mali</b>
      </a><br/>
      <a href="mailto:dhruvmali9039@gmail.com">dhruvmali9039@gmail.com</a>
    </td>
  </tr>
</table>

---

## ⚡ Quick Start

### Option 1: Automated Setup (Windows)
```bash
# Run the PowerShell script
.\start-dev.ps1
```

### Option 2: Manual Setup
```bash
# 1. Clone the repository
git clone https://github.com/Pratham2sharma/StackIT.git
cd StackIT-live

# 2. Install backend dependencies
npm install

# 3. Install frontend dependencies
cd frontend
npm install
cd ..

# 4. Start backend server (Terminal 1)
npm run backend

# 5. Start frontend server (Terminal 2)
cd frontend
npm run dev
```

### 🌐 Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000   
---

## 🔑 Default Admin Credentials

**Email**: `admin@example.com`  
**Password**: `123456`

*After login, click the "Admin Panel" button in the navbar to access admin features.*

## 🛠️ Development Notes

- **Redis**: Optional for development (disabled by default)
- **Database**: MongoDB Atlas (configured)
- **Environment**: Development mode enabled
- **Hot Reload**: Both frontend and backend support hot reloading

## 🏁 Built for the Odoo Hackathon 2025

We're proud to participate in the Odoo Hackathon — a place to create, collaborate, and showcase innovation.  
**StackIT** is our attempt at building something meaningful, scalable, and community-first.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).