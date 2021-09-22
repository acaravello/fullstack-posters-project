# fullstack-posters-project
A fullstack application in React and Node, where the user can choose between a list of posters, see the details, add a new poster etc. User logged-in can also edit and delete existing posters.

In order to use the application on local environment, you have to set two variables:
In /fe folder, add a .env file, with a variable REACT_APP_SERVER_ADDRESS initialized with the address of the be running on your machine (es. http://localhost:1337).
In the /be folder, add also an .env file, with a variable MONGODB_URI initialized with the address of the mongo db you wanna use (es. mongodb+srv://username:password@cluster0.f0qfx.mongodb.net/collectionName?retryWrites=true&w=majority)

run both the fe and the be with npm start, and you're ready to go!
