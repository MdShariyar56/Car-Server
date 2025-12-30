# 🚗 RentWheels – Car Rental Platform (Server Side)

🔗 **Live API Server:** https://your-server-api-url.vercel.app  

---

## 📌 About the Server
This is the **backend server** for the **RentWheels – Car Rental Platform**, built using **Node.js, Express.js, and MongoDB**.  
The server handles authentication, car management, booking operations, and availability control with secure REST APIs.

It is designed to support real-world features such as protected routes, booking validation, and role-based data access.

---

## 🛠️ Technologies Used
- Node.js
- Express.js
- MongoDB
- JWT (JSON Web Token)
- Firebase Admin SDK (Optional – Advanced Authorization)
- dotenv
- cors

---

## 🌐 API Features
- 🔐 JWT-based Authentication
- 🚘 Car CRUD Operations (Add, Read, Update, Delete)
- 📅 Booking Management System
- 🛑 Prevents Double Booking
- 🏷️ Car Availability Status (Available / Booked)
- 🔒 Protected Routes for Authorized Users
- ⚡ Optimized RESTful APIs

---

## 🔐 Authentication & Authorization
- JWT token generated after successful login
- Token verified for protected routes
- (Optional) Firebase Admin SDK used to:
  - Verify Firebase ID Tokens
  - Allow update/delete only by car owner
- Unauthorized access returns proper error responses

---

## 📁 API Endpoints Overview

### 🔹 Cars
- `GET /cars` → Get all cars
- `GET /cars/:id` → Get single car details
- `POST /cars` → Add a new car (Protected)
- `PUT /cars/:id` → Update car info (Protected & Owner Only)
- `DELETE /cars/:id` → Delete a car (Protected & Owner Only)

### 🔹 Bookings
- `POST /bookings` → Book a car (Protected)
- `GET /bookings?email=user@email.com` → Get bookings by user email
- Updates car status to **Booked** after successful booking

---

## 📅 Booking Logic
- A car can only be booked if its status is **Available**
- Once booked:
  - Booking data is stored in database
  - Car status is updated to **Booked**
- Prevents multiple users from booking the same car

---

## 🗄️ Database Structure (Simplified)

### Cars Collection
- carName
- description
- category
- rentPrice
- location
- image
- providerName
- providerEmail
- status (Available / Booked)
- createdAt

### Bookings Collection
- carId
- carName
- userEmail
- userName
- bookingDate
- rentPrice

---

## ⚙️ Environment Variables
Create a `.env` file in the root directory and add:

```env
PORT=5000
DB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FIREBASE_SERVICE_ACCOUNT=your_firebase_admin_credentials (optional)
