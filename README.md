# 🏨 HMS Pro – MERN-based Hotel Management System

HMS Pro is a full-featured hotel management platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js). Designed for both academic learning and real-world application, this system automates and streamlines hotel operations such as room booking, user authentication, hotel and room management, and email notifications. Inspired by real challenges in the hospitality industry, HMS Pro offers a scalable, secure, and user-friendly solution for hotels going digital.

---

## 🚀 Live Demo

Coming Soon...

---

## 📌 Key Features

### 🔐 Authentication & Authorization
- Secure login and registration using JWT.
- Role-based access for Admin and User.
- OTP verification and password reset via email.

### 🏨 Hotel & Room Management (Admin)
- Add, update, delete hotels and rooms.
- Track room availability, booking status, and occupancy.

### 📅 Booking Management
- Room booking with date range.
- Auto-approval and email notification system.
- Track bookings by user and hotel.

### 🎟️ Coupon & Discount Management
- Add and manage hotel-specific or global coupons.
- Auto-apply coupon codes during booking checkout.

### 📤 Image & Email Integration
- Cloudinary for hotel/room image upload and storage.
- Nodemailer for automated transactional emails (login, booking confirmation, password reset).

### 🌗 User Experience
- Clean and responsive UI built with React.js and Redux Toolkit.
- Theme toggling (Light/Dark) for personalized experience.
- Profile management and booking history.

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Redux Toolkit
- React Router
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT & Bcrypt

**Integrations:**
- Cloudinary (Image storage)
- Nodemailer (Email services)
- dotenv (Environment configuration)

---

## 📂 Project Structure

HMS-Pro/
│
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── config/
│ └── server.js
│
├── frontend/
│ ├── components/
│ ├── pages/
│ ├── redux/
│ ├── assets/
│ └── App.js
│
├── .env
├── package.json
└── README.md

---

## 📦 Installation & Setup

### Prerequisites:
- Node.js
- MongoDB (local or MongoDB Atlas)
- Cloudinary account
- Email account for Nodemailer (e.g., Gmail)

### Steps:

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/hms-pro.git
   cd hms-pro
Set up backend

  
Copy
Edit
cd backend
npm install
Add your .env file in /backend:

```ini

MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
Start the server:
```
```bash

npm run dev
Set up frontend
```
```bash

cd ../frontend
npm install
npm start
```
Open in Browser

Navigate to: http://localhost:3000

💡 Inspiration
This project is inspired by the real-world challenges faced in the hotel industry, especially by small to mid-size businesses. Having grown up observing the hospitality sector through my father's 25+ years of service, I wanted to address the inefficiencies in manual hotel processes and create a meaningful, full-stack digital solution.

📈 Future Improvements
Payment gateway integration (e.g., Razorpay/Stripe)

Mobile responsiveness & PWA support

Admin analytics dashboard

Guest feedback and rating system

Multilingual support

📚 License
This project is licensed under the MIT License.

🙋‍♂️ Connect With Me
Devesh Jangid
📧 jangiddevesh031gmail.com
🌐 LinkedIn : www.linkedin.com/in/devesh-jangid-a55227241
