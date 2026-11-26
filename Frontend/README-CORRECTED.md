# Student Performance LMS - Corrected

## Stack
- React + Vite frontend
- Express API backend
- MongoDB Atlas + Mongoose
- Axios for API requests

## 1. Backend setup
Open a terminal in the `Backend` folder:

```bash
npm install
```

Copy `.env.example` to `.env` and replace the MongoDB URI with your NEW Atlas connection string. Do not commit `.env`.

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

## 2. Frontend setup
Open a second terminal in the project root:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

Optional: create a root `.env` with `VITE_API_URL=http://localhost:5000/api` if your API uses another address.

## API routes
- `/api/students` - GET, POST; `/:id` - GET, PUT, DELETE
- `/api/activities` - GET, POST; `/:id` - GET, PUT, DELETE
- `/api/exams` - GET, POST; `/:id` - GET, PUT, DELETE

Student deletion also removes that student's activity and exam records.

## Data fields
- Student: `name`, `code`, `className`, `discipline`, `attitude`, `status`
- Activity: `studentId`, `date`, `category`, `description`, `points`, `completed`, `teacher`, `note`
- Exam: `studentId`, `exam`, `subject`, `date`, `marks`, `total`, `remark`

Pass mark is consistently set to 40% in the exam results UI. Activity points can be positive or negative.

## Important
This corrected version uses MongoDB for students, activities and exams. It does not use localStorage as the database. Existing MongoDB documents created with the older field names (`firstName`, `lastName`, `class`, etc.) need a migration before they can be displayed using the new field structure. Back up the database before migrating or deleting records.
