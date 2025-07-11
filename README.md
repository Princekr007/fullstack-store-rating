# Fullstack Store Rating Web Application

## Overview

This web application allows users to submit ratings for stores registered on the platform. The project is built as a FullStack Intern Coding Challenge and demonstrates best practices in both frontend and backend development. The solution is built with the following tech stack:

- **Backend:** ExpressJs/Loopback/NestJs framework (choose one implementation)
- **Database:** PostgreSQL or MySQL
- **Frontend:** ReactJs

## Features

### User Roles

- **System Administrator**
- **Normal User**
- **Store Owner**

### Functionality by Role

#### System Administrator

- Add new stores, normal users, and admin users.
- Dashboard displaying:
  - Total number of users
  - Total number of stores
  - Total number of submitted ratings
- Add new users (fields: Name, Email, Password, Address)
- View and filter lists of stores by Name, Email, Address, and Rating
- View and filter lists of users by Name, Email, Address, and Role
- View user details, including rating if Store Owner
- Log out

#### Normal User

- Sign up and log in
- Signup form fields: Name, Email, Address, Password
- Update password after logging in
- View and search all registered stores by Name and Address
- Store listings show: Store Name, Address, Overall Rating, User's Submitted Rating, option to submit or modify rating
- Submit ratings (1 to 5) for individual stores
- Log out

#### Store Owner

- Log in
- Update password after logging in
- Dashboard: View users who submitted ratings for their store, see average rating
- Log out

## Form Validations

- **Name:** 20–60 characters
- **Address:** Max 400 characters
- **Password:** 8–16 characters, must include at least one uppercase letter and one special character
- **Email:** Standard email validation

## Additional Notes

- All tables support sorting (ascending/descending) by key fields like Name, Email, etc.
- Database schema follows best practices for normalization and relationships.
- Both frontend and backend are structured according to best practices for scalability and maintainability.

## Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **PostgreSQL** or **MySQL**
- **npm** (for frontend and backend dependencies)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Princekr007/fullstack-store-rating.git
   cd fullstack-store-rating
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or for the frontend/backend if split
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Configure Environment Variables:**
   - Create `.env` files in backend and frontend with your database credentials, JWT secrets, etc.

4. **Run Database Migrations:**
   - Use your chosen ORM (e.g., Sequelize, TypeORM, Prisma) to migrate tables.

5. **Start the Application:**
   ```bash
   # Backend
   npm run start
   # Frontend
   npm run start
   ```

6. **Access the app in your browser:**
   ```
   http://localhost:3000
   ```

## Database Schema (Sample)

- **users**: id, name, email, password_hash, address, role
- **stores**: id, name, email, address, owner_id
- **ratings**: id, user_id, store_id, rating (1–5), created_at

## Best Practices

- RESTful API design
- Secure password hashing and authentication (JWT)
- Validation on both frontend and backend
- Role-based access control
- Pagination and sorting on listings

## Contribution

Feel free to fork and submit PRs for improvements or bug fixes!

## License

MIT License

## Contact

Created by [Princekr007](https://github.com/Princekr007)
