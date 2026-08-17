# Meeting Room Booking System
A GraphQL-based meeting room booking system that allows employees to book meeting rooms, manage participants, join waiting lists, check in to meetings, and manage recurring bookings. Administrators can manage rooms, equipment, maintenance, and booking analytics.

## Technologies
TypeScript
React
Tailwind CSS
Node/Express
GraphQL
Prisma ORM
PostgreSQL
bcrypt
JWT
Socket.IO

## Prerequisites to setup this project
Make sure the following are installed:
React.ts
Tailwind CSS
Node.ts
npm
PostgreSQL

## Installation
Clone the repository
https://github.com/deepanshusingh02697/BookMeetingRoom
cd Choose-Project-Folder
npm install
Craete .env file in the project and setup configurations
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/Database_Name"
JWT_SECRET="your-secret-key"

## Database setup
Run Prisma migrations: npx prisma migrate dev
Generate the Prisma client: npx prisma generate
Run the Application: "npm run dev" for frontend and "npm start" for backend


# Main Features

## Employee
Sign up and login
View available rooms
Search rooms by time, capacity, floor, and equipment
Create bookings
Create recurring bookings
Add and remove participants
Cancel bookings
Join and leave waiting lists
Check in to meetings
View upcoming meetings

## Administrator
Admin login
Create, update, enable, and disable rooms
Create and manage equipment
Add/remove equipment from rooms
Create and delete room maintenance periods
View booking calendar
View room usage analytics
Release bookings that were not checked in

## Business Rules
The application validates important booking rules, including:
1. Overlapping bookings are rejected.
2. Concurrent booking attempts are protected using database transactions.
3. Bookings in the past are rejected.
4. Invalid time ranges are rejected.
5. Room capacity cannot be exceeded.
6. Disabled rooms cannot be booked.
7. Rooms under maintenance cannot be booked.
8. Users cannot cancel another user's booking.
9. Unauthorized GraphQL operations are rejected.
10. Bookings without check-in can be marked as NO_SHOW.
11. Cancelled bookings can be assigned to users on the waiting list.
12. Recurring bookings are rejected if any occurrence conflicts with an existing booking.


# Improvements in future
The following features can be added to improve the project like:
1. Instead of adding participants directly, organizers can send meeting invitations. Participants can accept or reject invitations before becoming confirmed participants.
2. There can be a email notificatioins for meeting invitations, booking confirmations, cancellations,reminders for meetings before some time and waitlist conversion to booking by notify the employee/user.
3. We can allow to user to show their waitlist entry and provide a limited time to confirm about the booking for room.
4. we can provide real time update about the availability of the room even when the room release with capacity validations.
5. Add QR-code based check-in to make meeting checkin faster and easier.



