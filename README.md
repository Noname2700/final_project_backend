# News Article Backend

This is the backend for the news article website, which focuses on creating a server for the NewsExplorer application. This server brings to life the functionality of the site and provides strong security between the frontend and the backend.

## Overview

This server provides a safes way for the frontend and backend to communicate and send data amongs each other, As well tracking and limiting all request being made to APIs. The server works as follow:

- Stores data to MongoDB
- Grants authorization to save and delete articles(JWT)
- Verifies the authenticity of users through authentication(JWT & Cookie)
- Sends saved articles to our database
- Protecting the users account through password hashing(Crypto & Argon2)
- Keeps track of all fecth request and errors(Morgan & Winston)
- Maintain connection between frontend and backend(CORS)
- Limiting the amount of APIs request bieng made to the server(express-rate-limit)



## To Clone The Project

git clone https://github.com/Noname2700/final_project_backend.git

cd final_project_backend

## Running The Project

`npm install` — to install dependencies

`npm run dev` — to launch the server with the hot reload feature nodemon

`npm run start` — to launch the server for production



## Technology

- MongoDB
- JWT
- Validator
- CORS
- Argon2
- Crypto
- Helmet
- Morgan
- Winston
- Cookie-parser
- Nodemon
- Celebrate
- Express-rate-limit

## Frontend Repository

The frontend for the project can be found at:
("https://github.com/Noname2700/final_project_frontend")

This frontend provides:

- External API
- fetch
- UseState
- Router
- Navigate
- Navlink
- Media Queries
- Switch  

## Project Domain Name

- Frontend:https://newsarticles.chickenkiller.com/

- Backend:https://api3.chickenkiller.com/

