# Buy & Sell @ IIITH

A full-stack web application for buying and selling items within the IIIT Hyderabad community.

## Overview

This platform enables IIIT Hyderabad students to:

- Create user profiles with IIIT email addresses
- List items for sale in different categories
- Browse and search for items
- Add items to cart and complete purchases
- Track order history and manage transactions
- Exchange items securely using OTP verification

## Tech Stack

### Frontend
- React with Vite
- Chakra UI for styling
- React Router for navigation
- React Hook Form for form handling
- JWT for authentication

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password and OTP hashing

## Features

- **User Authentication**: Secure login/registration system with JWT
- **Profile Management**: Update personal information
- **Item Browsing**: Search and filter items by name and category
- **Shopping Cart**: Add/remove items and checkout
- **OTP Verification**: Secure item handover process
- **Order History**: Track pending orders, bought items, and sold items
- **Responsive Design**: Works on various screen sizes

## Installation Guide

### Prerequisites
- Node.js (v14+)
- npm or yarn package manager
- MongoDB (local instance or MongoDB Atlas connection)

### Setup Instructions

1. **Clone the Repository**
   


2. **Install and run frontend**
   ```bash
   cd frontend
   npm i
   npm run dev

3. **Install and run backend** (in a new terminal)
   ```bash
   cd backend
   npm install
   npm run dev