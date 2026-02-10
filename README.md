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
<summary>  <strong> Week 1: Planning and Prep </strong> </summary>
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
<summary>  <strong> Week 2: Development Setup </strong> </summary>
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
<summary>  <strong> Week 3: Login/Sign Up & VIN Input </strong> </summary>
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

## Resource Links 🔗

## GitHub Cheat Sheet ⚡️

General Use

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

Project Manager: Jazmin Gutierrez
Industry Mentor: Sam Stegall
Codirectors: Adarsh Goura and Suhani Rana
