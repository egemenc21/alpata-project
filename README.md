## A FULL STACK MEETING APP FOR ALPATA TECHNOLOGY
  In this project, I used React and Express.js for frontend and backend code. I implemented TypeScript for both of these frameworks. This project allows users to authenticate, register, sign-in, sign-out, create meetings, update, read, and delete a meeting.

## TO TRY THIS PROJECT
1-  For trying this project you should use this command on your computer to have this repository locally:  git clone git@github.com:egemenc21/alpata-project.git 
2- Then you should go to the project folder with: cd alpata-project
3- Then you should go to frontend and backend folder one at a time and do the following: 
   To run clientside locally:    
    cd frontend 
    yarn
    yarn dev
    
   To run serverside locally:    
    cd backend 
    yarn
    yarn dev
  
4- After doing that, you must have an .env file under the backend folder because the code uses this credential data to communicate with the database and send emails.
  DATABASE_URL = EXTERNAL CLOUD DATABASE URL
  JWT_SECRET = YOUR JWT SECRET
  CLIENT_URL = 'http://localhost:5173' (this is the client URL that we're going to use to fetch the API endpoints)
  SENDER_EMAIL = 'youremail@example.com'
  SENDER_PASSWORD = 'yourpassword'

5- After adding the .env file to the backend folder you should run the development server once again.
   yarn dev (http://localhost:4000)
6- Make sure that both servers are running on your console, Then you can successfully use the web app at http://localhost:5173 
