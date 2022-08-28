
<div align="center">
  <h1 align="center">Quote/Advice API</h1>
  <br />
  
   <!--  App Logo  -->
  <a href="https://github.com/nahmed44/weather-app">
     <img src="https://img.icons8.com/ios/color/250/1FB141/quote--v1.png" alt="Logo" width="300">
  </a>
  <br />
  
  
  <!--  Demo link  -->
  <!-- <a href="https://noman-weather-app.netlify.app/">Live Demo</a> -->
 
</div>


<!-- Intro -->
# Introduction
API written in Node using Express.js to retrive random Quote or Advice.

<!-- Tech Stack -->
# Tech Stack
|  |  |
|--|--|
| Framework | [Express.js](https://expressjs.com/) |
| DB | [SQLITE3](https://www.npmjs.com/package/sqlite3) |
| Authentication | [Passport.js](https://www.passportjs.org/) |


# Roadmap
- :white_check_mark: Register user
- :white_check_mark: Authentication
- :white_check_mark: Get/Add Advice
- :dart: Get/Add Quote
- :dart: Rate limiter

<!-- Getting Started -->
# Getting Started

## Prerequisites
Install npm.
* npm
  ```sh
  npm install npm@latest -g
  ```

## Installation

1. Clone the repo
   ```sh
   git clone https://github.com/nahmed44/quote-advice-api.git
   ```
   
2. Install NPM packages
   ```sh
   cd quote-advice-api
   npm install
   ```
   
3. Create a `config.env` file in the config directory
   ```sh
   cd config
   touch config.env
   ```
   
4. Add the following to `config.env` file
   ```env
   PORT = 3000
   SESSION_SECRET = your-session-secret
   ```

 5. Run the project
    ```sh
    npm run dev
    ```







# Acknowledgments
 - Icon by [ICONS8](https://icons8.com/)
