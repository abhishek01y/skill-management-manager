# Resource Management System — MongoDB Atlas

Internal HR tool for tracking employee profiles, skills, and rankings.

## Tech Stack
| Layer    | Technology                              |
|----------|-----------------------------------------|
| Backend  | Java 17 + Spring Boot 3.2               |
| Database | **MongoDB Atlas** (cloud)               |
| Frontend | React 18 + React Router 6               |
| Build    | Maven (backend), npm (frontend)         |

---

## MongoDB Atlas Setup

### Step 1 — Create free cluster on MongoDB Atlas
1. Go to https://cloud.mongodb.com
2. Create a free account → Build a Database → **Free (M0)**
3. Choose cloud provider & region → Create Cluster

### Step 2 — Create DB User
- Go to **Database Access** → Add New User
- Username: `resourceuser`, Password: (save it)
- Role: **Read and write to any database**

### Step 3 — Allow IP Access
- Go to **Network Access** → Add IP Address
- For development: **Allow Access from Anywhere** (0.0.0.0/0)
- For production: add your server's IP only

### Step 4 — Get Connection String
- Go to **Database** → Connect → **Connect your application**
- Select Driver: Java, Version: 4.3+
- Copy the URI — looks like:
  ```
  mongodb+srv://resourceuser:<password>@cluster0.abc12.mongodb.net/?retryWrites=true&w=majority
  ```

### Step 5 — Update application.properties
```properties
spring.data.mongodb.uri=mongodb+srv://resourceuser:YOUR_PASSWORD@cluster0.abc12.mongodb.net/resourcedb?retryWrites=true&w=majority
spring.data.mongodb.database=resourcedb
```

---

## Run the App

### Backend
```bash
mvn spring-boot:run
# Starts at http://localhost:8080
# DataSeeder auto-inserts 8 sample employees in MongoDB on first run
```

### Frontend
```bash
cd frontend
npm install
npm start
# Starts at http://localhost:3000
```

---

## MongoDB Data Structure

Skills are **embedded inside the Employee document** (no separate collection):

```json
{
  "_id": "ObjectId(...)",
  "name": "Anjali Sharma",
  "role": "Senior Developer",
  "department": "Engineering",
  "email": "anjali@company.com",
  "status": "ACTIVE",
  "avatarColor": "av-blue",
  "skills": [
    { "id": "uuid-string", "skillName": "Java",        "category": "Backend", "proficiency": 92 },
    { "id": "uuid-string", "skillName": "Spring Boot", "category": "Backend", "proficiency": 85 },
    { "id": "uuid-string", "skillName": "SQL",         "category": "Data",    "proficiency": 78 }
  ]
}
```

---

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET    | /api/employees | All employees |
| GET    | /api/employees/{id} | One employee (String ID) |
| POST   | /api/employees | Create employee |
| PUT    | /api/employees/{id} | Update employee |
| DELETE | /api/employees/{id} | Delete employee |
| GET    | /api/employees/ranked | Ranked by skill score |
| GET    | /api/employees/top?n=5 | Top N employees |
| POST   | /api/employees/{id}/skills | Assign/update skill |
| DELETE | /api/employees/{empId}/skills/{skillId} | Remove skill (UUID) |
| GET    | /api/employees/search?q=java | Search name/role |
| GET    | /api/employees/department/{dept} | Filter by dept |
| GET    | /api/employees/by-skill?name=Java | Filter by skill |
| GET    | /api/employees/by-status?status=ACTIVE | Filter by status |
| GET    | /api/meta/departments | All departments |
| GET    | /api/meta/skills | All skill names |
| GET    | /api/meta/categories | All categories |
| GET    | /api/dashboard | Summary stats |

---

## Key Difference from MySQL Version

| Feature | MySQL Version | MongoDB Version |
|---------|--------------|-----------------|
| Skills storage | Separate `employee_skills` table (JOIN) | Embedded array in employee document |
| Employee ID type | `Long` (auto-increment) | `String` (MongoDB ObjectId) |
| Skill ID type | `Long` | `String` (UUID) |
| Queries | JPQL / HQL | Spring Data MongoDB + @Query regex |
| Schema | Fixed (DDL) | Flexible (schemaless) |
