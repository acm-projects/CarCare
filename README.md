<p align="center">
  <img src = "https://i.pinimg.com/originals/30/6b/28/306b28b8d4746e7c33f05329e7b62b07.gif"/>   
</p>

<h1 align="center"> CarCare 🚗 </h1>
CarCare is a smart, mobile companion designed to simplify vehicle maintenance for everyday drivers. With so many unique components that contribute to a car’s health, it can be overwhelming to keep up with each contributing factor and service that needs to be done. CarCare is designed to help keep all your car knowledge in one place by helping you keep track of service dates, find and guide through practical at-home maintenance solutions, and find trusted local shops when expert help is needed. With imaging and scanning, uploading information is simple when CarCare is behind the wheel taking the driving actions to organize it for you.

## MVP 🏆
- User login with FirebaseAuth and input VIN to generate car information
- Add appointments & service reminders directly to user’s Google Calendar with image upload of oil change or registration sticker, estimated tire rotations, fluid refills, etc. based on mileage, time, and frequency
- For each needed service, give recommendations on scheduling local appointments, provide online resources for individuals to repair, and give interactive step-by-step at home solutions for easy to fix problems based on user’s car model with time and difficulty estimates
- AI assistant for help with issue diagnosis and repair recommendations
- Add multiple cars to track with each represented by a different color on the calendar

## Stretch Goals 🏁
- Repair cost estimates and expense tracker to help with monthly budgeting
- Personalized UI: Have generated image/model of user’s current car and page accent colors based on vehicle color
- Car comparison page with side by side comparison of current vehicle to another model that user is interested in purchasing
- Provide listings of cars that user is interested in purchasing compiled from variety of online marketplaces/manufacturers
- Interactive community chatting page

## Milestones 📆
<details closed>
<summary>  <strong> Week 1: Planning and prep </strong> </summary>
<br>
  
- Assign frontend/backend roles and discuss tech stack
- Set up communications and WhenToMeet for scheduling
- Frontend:
    - Begin UI/UX design/wireframing on Figma
- Backend:
  - Start learning Firebase authentication and storage
  - Start studying API setup/usage

</details>

<details closed>
<summary>  <strong> Week 2: Development setup </strong> </summary>
<br>
  
- Frontend:
  - Finalize UI/UX design on Figma
  - Set up React Native and Expo environment
  - Begin coding login/sign up pages
  - Set up basic navigation tabs
- Backend:
  - Set up FirebaseAuth and database
  - Test VIN API with dummy data

</details>

<details closed>
<summary>  <strong> Week 3: Login/Sign up & VIN input </strong> </summary>
<br>
  
- Frontend:
  - Finalize login/sign up pages
  - Work on user navigation for uploading VIN and displaying data on profile page
- Backend:
  - Integrate authentication and VIN details
  - Begin implementation of Google OAuth for calendar access

</details>

<details closed>
<summary>  <strong> Week 4: Services & calendar </strong> </summary>
<br>
  
- Frontend:
  - Start UI/UX for upload of services (manual and then image upload)
- Backend:
  - Create and test function for event creations
  - Test out OCR with image uploading

</details>

<details closed>
<summary>  <strong> Week 5: (Mid Semester Review on March 11th!) </strong> </summary>
<br>
  
- Frontend:
  - Finalize UI/UX for image uploading
  - Consider loading states, error handling, and confirmation pop ups
- Backend:
  - Auto create events from image upload
  - Create logic for other estimated reminders to add to calendar

</details>

<details closed>
<summary>  <strong> Week 6:  Local mechanics page </strong> </summary>
<br>

- Frontend:
  - Work on display of local repair shops page
- Backend:
  - Integrate Google Places API
  - Start looking into AI implementation for problem diagnosis and repair recommendations

</details>

<details closed>
<summary>  <strong> Week 7: At-home guidance </strong> </summary>
<br>
  
- Frontend:
  - Work on at-home repair solutions page/guide
- Backend:
  - Connect AI to repair guide
  - Use YouTube API to provide video references

</details>

<details closed>
<summary>  <strong> Week 8: Wrap up & prep </strong> </summary>
<br>

- Finalize features
- Start slideshow/script
- Consider outfit/props for presentation

</details>

<details closed>
<summary>  <strong> Week 9/10: Final touches & presentation prep </strong> </summary>
<br>
  
- Modify slideshow/script
- Mock presentations!!!
- Make changes based on feedback
- Practice, practice, practice
- Present 🙂🙌

</details>

## Tech Stack 💻
IDE: VSCode  
Wireframing: Figma  
Frontend: React Native + Expo + Tailwind (NativeWind)  
Backend: Firebase + Google APIs

## Resource Links 🔗

<strong> React Native + Expo </strong>
- [React Native Basics](https://reactnative.dev/docs/tutorial?language=javascript)
- [Environment Setup](https://reactnative.dev/docs/environment-setup)
- [Environment Setup with Expo](https://docs.expo.dev/router/installation/)
- [Build Full Stack App in React Native](https://www.youtube.com/watch?v=eYByUtXQbEo)
- [React Native Course](https://www.youtube.com/watch?v=ZBCUegTZF7M&t=1396s)
- [React Native Tutorial](https://www.youtube.com/watch?v=qmB6QCua3Uk&pp=ygUKTmF0aXZlV2luZA%3D%3D)

<strong> Tailwind (NativeWind) </strong>
- [Tailwind CSS Tutorial for Beginners](https://www.youtube.com/watch?v=DenUCuq4G04)
- [Tailwind CSS (NativeWind in React Native](https://www.youtube.com/watch?v=DenUCuq4G04)

<strong> UI/UX Design </strong>
- [Do's and Don'ts of Mobile App Design](https://realmonkey.co/mobile-app-design/the-dos-and-donts-of-mobile-app-design/)


<strong> Backend </strong>
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbElYV09jRnZiM3pseW1hcXBSSlV0THlBaUJjQXxBQ3Jtc0tscXd1MkZKV0c4S3dqMmtkMktTdU9EV3M3cUo2OV9RVTNUUVQ5QjVGLWw5UEFwc2hjWFRHbTlIVWhyTjJWOXVFQWVNNzJYSnhhTVBJWDlMVVc1RFdKdm10WFFkSjBSd0VKT2xYck1uWVUxTzZtaVpoOA&q=https%3A%2F%2Ffirebase.google.com%2Fdocs%2Fauth%2F&v=Bj15-6rBHQw)
- [Build a React Native App with Firebase Auth & Chat](https://www.youtube.com/watch?v=INxkJno2gIs&list=PLKWMD009Q4qRvrfjGotVfUbqGoLdvRDN4)

<strong> APIs </strong>
- [Fetching Data from an API in React Native](https://www.youtube.com/watch?v=KJhg761xb3c)
- [React Native Tutorial - POST Request](https://www.youtube.com/watch?v=BecN2PxyR_0)
- [React Native tutorial - API Call](https://www.youtube.com/watch?v=NuKQk7nbk0k) 

- [Postman Tutorial](https://www.youtube.com/watch?v=MFxk5BZulVU)
- Vehicle Data
  - [VIN Decoder](https://www.nhtsa.gov/nhtsa-datasets-and-apis)
  - [Vehicle API](https://vpic.nhtsa.dot.gov/api/)
  - [OCR](https://docs.cloud.google.com/vision/docs/ocr)
- Google Calendar
  - [Google Calendar API](https://youtu.be/Bj15-6rBHQw?si=1O5VOYdq3883i62r)
  - [Google Calendar API with Node.js](https://www.youtube.com/watch?v=2byT7fYT8UE)
- Google Places
  - [Google Places Overview](https://developers.google.com/maps/documentation/places/web-service/overview)
  - [Google Places Javascript to Display Nearby Places](https://youtu.be/iOif0eHQbHY?si=0GR4GCqbxz93w-is)

## GitHub Cheat Sheet ⚡️

| Command | Description |
| ------ | ------ |
| cd "CarCare" | Change directories over to our repository |
| git branch | Lists branches for you |
| git branch "branch name" | Makes new branch |
| git checkout "branch name" | Switch to branch |
| git checkout -b "branch name" | Same as 2 previous commands together |
| git add . | Finds all changed files |
| git commit -m "Testing123" | Commit with message |
| git push origin "branch" | Push to branch |
| git pull origin "branch" | Pull updates from a specific branch |

## Developers ⭐
- Karl Ngonge
- Rudra Chauhan
- Pranav Cheedalla
- Madailein Quinn
- Vaishnavi Siravuri

<strong> Project Manager: </strong> Jazmin Gutierrez  
<strong> Industry Mentor: </strong> Sam Stegall  
<strong> Codirectors: </strong> Adarsh Goura and Suhani Rana
