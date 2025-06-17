# 📱 Nosedive - A Black Mirror- Inspired Social Rating App

> React Native clone of Instagram with a twist – inspired by the *Black Mirror* episode “Nosedive”, where your social status is everything.

## 🌌 About the Project

**Nosedive** is a mobile social network concept app built with **React Native**, designed in the style of **Instagram** – but with a darker, satirical edge. Inspired by *Black Mirror’s* "Nosedive" episode, users can view each other's posts and **rate them directly**, affecting each user's public score.

🧠 The goal: reflect on the consequences of social validation and rating culture – while also demonstrating modern mobile app development practices.

## 🚀 Features

- 🔐 **Firebase Authentication** – secure login/signup with email validation
- 🖼️ **Image & Video Feed** – like Instagram
- ⭐ **User Ratings System** – rate users from 0 to 5 stars
- 💬 **Real-Time Chat** – powered by **Socket.IO**
- 📈 **Profile & groups** - explore & preview
- 📱 **Responsive Design** – optimized for both Android & iOS
- 🌑 **Dark Mode / Nosedive Theme** – violet + turquoise aesthetics

## 🛠️ Tech Stack

- **React Native + Expo**
- **Firebase Authentication** - email & password
- **MongoDB + Express.js Backend**
- **Socket.IO** for real-time messaging
- **Tailwind CSS** (via NativeWind)
- **Glustack** - React Native components
- **Cloudinary** for media hosting

## 📦 Installation

```bash
git clone https://github.com/yourusername/nosedive-app.git
cd Client
npm install
npm run
```

## ⚙️ Backend Setup

You’ll also need to run the backend server:

```bash
cd Server
npm install
npm run dev
```

You should configure `.env` for Firebase, MongoDB URI, Cloudinary and etc (according to .env.example files).


## 📸 Screenshots

| ![Image 1](assets/login.jpeg) | ![Image 2](assets/register.jpeg) | ![Image 3](assets/main_app.jpeg) |
|-----------------------------|----------------------------|------------------------------|
| **Login Screen** - This is the user login page where users can sign in with their credentials. | **Register Screen** - This screen allows users to create a new account with necessary information like email and password. | **Main App Screen** - The home screen of the app where users can browse different recipe categories. |

| ![Image 4](assets/map_app_carousels.jpeg) | ![Image 5](assets/category_selection.jpeg) | ![Image 6](assets/recipe_details.gif) |
|---------------------------------|----------------------------------|---------------------------------|
| **Carousel Feature** - A carousel feature for browsing different recipe categories or featured recipes in a visually appealing way. | **Category Selection** - This screen allows users to select a specific category of recipes, such as Vegan, Dessert, or Chicken. | **Recipe Details** - Displays the recipe with ingredients, instructions, and the option to mark it as a favorite or share. |

| ![Image 7](assets/search_by_favourites.jpeg) | ![Image 8](assets/add_recipe_1.jpeg) | ![Image 9](assets/app_recipe_2.jpeg) |
|-------------------------------------|---------------------------------|--------------------------------|
| **Search by Favourites** - This feature enables users to filter recipes based on their favorites, making it easy to find saved recipes. | **Add Recipe Screen** - Users can add a new recipe by inputting ingredients, steps, and other relevant details. | **Add Recipe Screen** - Users can add a new recipe by inputting ingredients, steps, and other relevant details. |


## 🧠 Inspiration

This project is heavily inspired by the *Black Mirror* episode "**Nosedive**", which critiques how social credit systems and constant peer validation can control people’s lives. This app imagines what that might look like in an Instagram-like world.



Made with 💚 by [Yaniv Ridel](https://github.com/Yanivridel)
