# 🏆 Resource Management System

<div align="center">

### *Track Skills. Rank Talent. Build Better Teams.*

[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=java&logoColor=white)](https://www.java.com)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-Cloud-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

> An internal HR tool for tracking employee profiles, skill sets, and performance rankings — built with Java Spring Boot + MongoDB Atlas + React.

</div>

---

## 📸 Screenshots

### 🧑‍💼 Employee Dashboard
> All team members with skill profiles, real-time rankings, and department filters

![Employee Dashboard](screenshots/employees.png)

### 🏆 Rankings Page
> Leaderboard ranked by skill score with top skill insights and department breakdown

![Rankings Page](screenshots/rankings.png)

---

## ✨ Features

### 👥 Employee Management
- Add, update, and delete employee profiles
- Department-wise filtering with smart search
- Avatar color picker and auto-generated initials
- Employee status tracking: `ACTIVE`, `INACTIVE`, `ON_LEAVE`

### 🎯 Skill Assignment
- Assign skills with proficiency % (1–100) per employee
- AI-powered skill suggestions based on existing skills
- Live proficiency bar preview while assigning
- Update or remove skills with one click

### 📊 Smart Rankings
- Auto-rank employees by average skill score
- 🥇🥈🥉 medal badges for top 3
- Department-filtered leaderboard
- Mini progress bars with top skill display

### 📈 Dashboard & Analytics
- Bar chart: Average skill score by department
- Pie chart: Score distribution across employees
- Radar chart: Top skills by proficiency
- Top 5 employees leaderboard with score rings

### 🎨 Premium UI
- Click any card → Full employee profile modal with score ring
- Smooth hover animations (lift + shadow + scale)
- Dark / Light mode toggle
- Skeleton loading states
- Toast notifications (success / error)
- Gradient score rings and animated skill bars

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Java 17 + Spring Boot 3.2 |
| **Database** | MongoDB Atlas (Cloud) |
| **Frontend** | React 18 + React Router 6 |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Fonts** | Sora + Inter (Google Fonts) |
| **Build** | Maven (backend) · npm (frontend) |

---

## 📁 Project Structure

```
resource-management/
│
├── pom.xml                                  ← Maven config (Spring Boot + MongoDB)
├── README.md
│
├── backend/
│   └── src/main/
│       ├── resources/
│       │   └── application.properties       ← MongoDB Atlas URI config
│       └── java/com/company/resourcemgmt/
│           ├── ResourceMgmtApplication.java ← Spring Boot entry point
│           ├── config/
│           │   ├── CorsConfig.java          ← CORS setup for React
│           │   └── DataSeeder.java          ← Auto-seeds 8 sample employees
│           ├── controller/
│           │   ├── ResourceController.java  ← 17 REST endpoints
│           │   └── GlobalExceptionHandler.java
│           ├── dto/
│           │   ├── EmployeeDTO.java
│           │   ├── EmployeeRequest.java
│           │   ├── SkillRequest.java
│           │   ├── DashboardStatsDTO.java
│           │   └── ErrorResponse.java
│           ├── model/
│           │   ├── Employee.java            ← MongoDB @Document
│           │   └── EmployeeSkill.java       ← Embedded document (no join)
│           ├── repository/
│           │   └── EmployeeRepository.java  ← MongoRepository + @Query
│           └── service/
│               └── EmployeeService.java     ← All business logic
│
└── frontend/
    ├── package.json                         ← React + Recharts + Lucide
    ├── public/index.html
    └── src/
        ├── App.jsx                          ← Router + Sidebar + Dark Mode
        ├── index.js
        ├── components/
        │   ├── MetricBar.jsx                ← 4 stat cards with icons
        │   ├── EmployeeCard.jsx             ← Hover + click-to-expand card
        │   ├── EmployeeProfileModal.jsx     ← Full profile with score ring
        │   ├── RankTable.jsx                ← Leaderboard table
        │   ├── AssignSkillModal.jsx         ← AI suggestions + live preview
        │   └── AddEmployeeModal.jsx         ← Avatar picker + live preview
        ├── pages/
        │   ├── EmployeesPage.jsx            ← Main dashboard
        │   ├── RankingsPage.jsx             ← Rankings + top skills chart
        │   └── DashboardPage.jsx            ← Bar, Pie, Radar charts
        ├── services/
        │   └── api.js                       ← All fetch calls to backend
        └── styles/
            └── main.css                     ← Full design system
```

---

## ⚡ Quick Start

### Step 1 — MongoDB Atlas Setup

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and create a **free M0 cluster**
2. **Database Access** → Add user with `read/write` permissions
3. **Network Access** → Add IP: `0.0.0.0/0` (allow all for dev)
4. **Connect** → Drivers → Copy the URI

### Step 2 — Configure Backend

Edit `backend/src/main/resources/application.properties`:

```properties
spring.data.mongodb.uri=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/resourcedb?retryWrites=true&w=majority
spring.data.mongodb.database=resourcedb
server.port=8080
```

### Step 3 — Run Backend

```bash
mvn spring-boot:run
```

> ✅ Backend starts at `http://localhost:8080`
> ✅ `DataSeeder` auto-inserts **8 sample employees** on first run

### Step 4 — Run Frontend

```bash
cd frontend
npm install        # installs React, Recharts, Lucide React
npm start
```

> ✅ Frontend starts at `http://localhost:3000`

---

## 🔌 API Reference

### Employee Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/employees` | Get all employees |
| `GET` | `/api/employees/{id}` | Get one employee |
| `POST` | `/api/employees` | Create employee |
| `PUT` | `/api/employees/{id}` | Update employee |
| `DELETE` | `/api/employees/{id}` | Delete employee |
| `GET` | `/api/employees/ranked` | All employees ranked by skill score |
| `GET` | `/api/employees/top?n=5` | Top N employees |
| `GET` | `/api/employees/search?q=java` | Search by name or role |
| `GET` | `/api/employees/department/{dept}` | Filter by department |
| `GET` | `/api/employees/by-skill?name=Java` | Filter by skill |
| `GET` | `/api/employees/by-status?status=ACTIVE` | Filter by status |

### Skill Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/employees/{id}/skills` | Assign or update a skill |
| `DELETE` | `/api/employees/{empId}/skills/{skillId}` | Remove a skill |

### Metadata & Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/meta/departments` | All department names |
| `GET` | `/api/meta/skills` | All skill names |
| `GET` | `/api/meta/categories` | All skill categories |
| `GET` | `/api/dashboard` | Summary stats + top skills + dept breakdown |

### Sample Requests

```bash
# Create an employee
curl -X POST http://localhost:8080/api/employees \
  -H "Content-Type: application/json" \
  -d '{"name":"Rahul Verma","role":"QA Engineer","department":"Engineering","email":"rahul@co.com"}'

# Assign a skill
curl -X POST http://localhost:8080/api/employees/{id}/skills \
  -H "Content-Type: application/json" \
  -d '{"skillName":"Selenium","category":"Backend","proficiency":85}'

# Get rankings
curl http://localhost:8080/api/employees/ranked

# Dashboard stats
curl http://localhost:8080/api/dashboard
```

---

## 🍃 MongoDB Data Structure

Skills are **embedded inside the Employee document** — no joins, no separate collections:

```json
{
  "_id": "ObjectId(abc123...)",
  "name": "Anjali Sharma",
  "role": "Senior Developer",
  "department": "Engineering",
  "email": "anjali@company.com",
  "phone": "+91 98100 11111",
  "avatarInitials": "AS",
  "avatarColor": "av-blue",
  "status": "ACTIVE",
  "skills": [
    { "id": "uuid-1", "skillName": "Java",        "category": "Backend", "proficiency": 92 },
    { "id": "uuid-2", "skillName": "Spring Boot", "category": "Backend", "proficiency": 85 },
    { "id": "uuid-3", "skillName": "SQL",         "category": "Data",    "proficiency": 78 },
    { "id": "uuid-4", "skillName": "Docker",      "category": "DevOps",  "proficiency": 65 }
  ]
}
```

> **Skill Score** = Average of all proficiency values = `(92 + 85 + 78 + 65) / 4 = 80%`

---

## 🔄 MySQL → MongoDB: What Changed

| Feature | MySQL Version | MongoDB Version |
|---------|--------------|-----------------|
| Skills storage | Separate `employee_skills` table | Embedded array in Employee doc |
| Employee ID | `Long` (auto-increment) | `String` (MongoDB ObjectId) |
| Skill ID | `Long` | `String` (UUID) |
| Dependency | `spring-boot-starter-data-jpa` + MySQL driver | `spring-boot-starter-data-mongodb` |
| Queries | JPQL / HQL | Spring Data MongoDB + `@Query` regex |
| Schema | Fixed DDL | Flexible, schemaless |
| Join collection | `EmployeeSkillRepository` needed | Removed entirely |

---

## 🎨 UI Features

### Employee Cards
- Hover → card lifts with spring animation + glow border
- Click → full profile modal with score ring
- Skill bars animate on load with gradient fill
- 🥇🥈🥉 medals for top 3 ranked employees

### Dark Mode
- Toggle in sidebar (sun/moon icon)
- All colors auto-switch via CSS variables
- Persists during session

### AI Skill Suggestions
- When assigning skills, the system suggests relevant skills based on existing ones
- Example: Employee has `Java` → suggests `Spring Boot`, `Docker`, `Microservices`

### Charts (Dashboard)
- **Bar chart** — Avg skill score by department
- **Pie chart** — Score distribution (90–100%, 75–89%, etc.)
- **Radar chart** — Top 6 skills proficiency web
- **Horizontal bar** — Team size per department

---

## 👤 Employee Status Values

| Value | Meaning |
|-------|---------|
| `ACTIVE` | Currently working |
| `INACTIVE` | Not currently active |
| `ON_LEAVE` | On leave |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<div align="center">

Built using **Java Spring Boot** + **MongoDB Atlas** + **React**

</div>
