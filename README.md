# Vue Time Tracker App

This application is designed to help you track time efficiently. It allows you to input the number of minutes you want to track and saves this information in your browser using IndexedDB. This means your data is saved locally and can be accessed even when you're offline.

## Features

- **Time Input**: The application provides an input field where you can enter the number of minutes you want to track.

- **Time Tracking**: Once you've input your time, the application starts tracking. You can pause, resume, or reset the timer as needed.

- **Data Persistence**: All tracked time data is saved in IndexedDB, a low-level API for client-side storage of significant amounts of structured data. This allows for high performance and availability of data, even when you're offline.

## How It Works

The application uses Vue 3 for the frontend and IndexedDB for data storage. When you input a number of minutes and start the timer, the application begins tracking time. This data is then stored in IndexedDB, allowing you to keep track of your time even across different browsing sessions.

## Getting Started

To get started with this application, you'll need to have Node.js and npm installed. Once you have those, you can install the project dependencies with `npm install`, and then start the application with `npm run serve`. The application will be available at `localhost:8080`.

We hope this application helps you in tracking your time more efficiently!