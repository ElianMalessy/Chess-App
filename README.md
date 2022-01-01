# Chess For Friends
#### Video Demo:
https://youtu.be/mMG3XcEcBhU
#### Description: 
This project is a chess website created mainly using react.js, and uses firebase as a backend through hosting and a database. The main idea is to allow friends to play a game together, inspired by features of websites like lichess.com. React and Firebase was what I had in mind from the start to create my project, and firebase proved very useful by giving all of the features in managing users e.g, logging in, changing username, creating an account etc... It also removed the need for something like a node.js server, as its realtime database allowed for communication between two computers, something that I didnt realize until I had already written a server javascript file. 

The login and signup pages used firebase functions, and also used a third party library called react-particles-js. They link to each other, and also have a forgot password option in which through a firebase function, an email will be sent to your email address, and by following the instructions you will be able to change your password. After logging in, creating an account, or signing up anonymously; you will be directed to the homepage. The homepage has a navbar at the top, which has a play button which creates a game at https://first-project-b7070.web.app/Game/'a random number in between 1 and 100', This url is also located at the bottom of the page with a clickable copy to clipboard button. On the far right side of the navbar, there is a profile section, with a profile picture, and a dropdown giving the options to customize the profile, or logout. The profile picture is clickable and drops down a modal which lets you edit your profile picture by zooming in and moving it around. It also lets you add a new profile picture with either a url, or a file from your computer. clicking the save button will save this selection and also save it to firebase. Very infrequently I had CORS issues, but I didn't feel it was important enough to spend time on, 'it didnt seem very easy to fix with me just using react, and I didnt want to pay for a cloud function from firebase'. The profile link on the dropdown brings you to a page in which you can change your username, and password, as well as delete your account. The homepage also features an almost fully css chessboard, which is able to spin, and move around the screen.

When creating the game, My idea to keep pieces centered on their squares was to simply have them be children in the DOM, rather than having the board be a certain amount of pixels and the pieces having a set css position as it was simpler to implement. I also used id and jquery to make moves, by assigning a white pawn at e2 the id Pe2, and a move e2 to e4 would be recognized by the end position of the cursor over the square of id Se4 and then Pe2 would be appended to Se4 via jquery. This id solution was inelegant and prone to user manipulation via developer tools, so I decided to switch to using a 2d array to represent the board. This made calculating things like check and if a move was possible much more secure, but I still kept some of the jquery simply because It would take too long to replace all of it. 

To keep the board the exact same on a reload of the page, I looked to FEN, 'Forsyth–Edwards Notation', a way of describing the board position in a string of characters. rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - is the default position for example. This notation also stores whose turn it is, how many ways there are to castle left, and a square that a pawn can go to for enpassent. The communication of a move to the other side is done by updating the game in the realtime database. Specifically the FEN is updated, and lastMove is set to something like pe2, pe4. If the move created a check, the check field in the database would be set to the pieces checking e.g, 'Qe7'. I didnt just allow setFEN to change the board of the player recieving the move because I had some complications with setBoard triggering errors because I had changed the id of some of the pieces. This means that when react is trying to delete these old pieces and replace them with new ones, it can't find the old pieces beacuse I had changed the id of them separate from their initial state without updating the state. 

### Files:
# src/serviceWorkerRegistration.js: 
code created by create-react-app.
# src/service-worker.js: 
Code created by create-react-app.
# src/index.js: 
Code created by create-react-app.
# src/firebase.js: 
Creates a firebaseApp instance, exports a database instance and an auth instance. The database instance allows for reading and writing of the realtime database, which is what I will use to communicate from one player to the other, and the auth instance allows the create accounts, logging users in, and signing them out.
# src/contexts/AuthContext.jsx:
Uses the Auth instance to create a context to export which contains utility functions like login, signup and deleteCurrentUser These functions will be used in other files by importing the context and using the useContext hook on the context via the function useAuth.
# src/config/Background-particles.js:
config file for a moving interactive background via the react-particles-js library which is used in the Login and Signup pages.
# src/components/PrivateRoute.jsx:
clean way of only allowing logged in users to access parts of the website, like the homepage, and update-profile by redirecting them to login.
# src/components/App.jsx:
Contains all of the routes to the components, as well as giving the components access to the auth functions with the AuthProvider tag.
# src/components/login/Signup.jsx: 
Signup page which uses the create user firebase function, also has links to play as guest which also uses a firebase function to sign in anonymously, and the login page.
# src/components/login/Login.jsx:
Login page which uses the login firebase function, also has links to play as guest, the signup page, and forgot password. The login also uses the moving background component from Background.jsx.
# src/components/login/ForgotPassword.jsx:
Allows users to reset their password. Sends an email to their email address which lets them fill out a form to reset their password.
# src/components/login/Background.jsx:
Creates a component from the config file in config/Background-particles.js.
# src/components/homepage/Dashboard.jsx: 
Has a navbar which has a play button which links to a game, and a customizable profile, 'profile picture, username and password'. css chessboard in the center to play around with, link to play a game to share with friends, same link as what you would go to if you clicked the play button on the navbar.
# src/components/homepage/convertToFile.js:
Functions which are used in the conversion of images given in the selection of a profile picture. This is necessary to store them on firebase.
# src/components/homepage/ChessModel.jsx:
css chessboard, able to spin around, move up, down, etc...
# src/components/homepage/Modal/ModalContainer.jsx:
Enables the animations for the modal.
# src/components/homepage/Modal/Modal.jsx:
Drops in from the top in a framer motion animation. A form to change profile picture with an image link or a file from your computer. Adjustable profile picture with zoom and translation. Exports the image to Dashboard.jsx when the save button is clicked. Modal drops down when the screen around the modal is clicked or the 'Close' button is clicked.
# src/components/homepage/Modal/Backdrop.jsx:
Sets up the motion div and sets the color of the background surrounding the modal to be a slightly transparent black when the modal is visible.
# src/components/homepage/Modal/ProfilePic/ProfilePic.jsx:
Creates a canvas of the image which changes as the user zooms in or translates, and saves that in state which Modal.jsx can use.
# src/components/homepage/dropdown/UpdateProfile.jsx:
Allows users to change their username, password, and delete their account
# src/components/game/utilityFunctions.js:
Exports miscellaneous utility functions. They give the position of a piece, make a copy of a 2d array, update the castling portion of the FEN, and give the positions of all of the pieces of a particular color except for the king, respectively.
# src/components/game/RightPanel.jsx:
Has text which is either 'white' or 'black', telling the players whose turn it is. Also has a copyable FEN at the bottom.
# src/components/game/Piece.jsx:
Piece component which is draggable by setting the css position at the mouse position, and only draggable by the player whose color matches the piece color. When a piece is clicked, possible moves are calculated, and at the end of a drag, only if the square which the mouse is hovering over is one of those possible moves calculated at the start of the drag, will the move go through. Sends information like the move and the new turn through state up to Game.jsx.
# src/components/game/moveFunctions.js:
This file has functions for calculating check, checkmate, and possible moves.
# src/components/game/Game.jsx:
Contains the event listeners for a move from another player, recalculates the FEN and updates the realtime database after you make a move with the information given through a state change from Piece.jsx. Contains the 2d array representing the board and changes it after the FEN is updated.
# src/components/game/Chat.jsx:
Allows players to communicate with each other via the realtime database, and after there is a checkmate, a checkmate message is sent here.
# src/components/game/CapturedPanel.jsx:
Displays all of the pieces you have captured.
# src/components/game/Board.jsx:
With the information provided with the FEN, constructs the jsx for the board by arranging Piece components and giving them the correct id's
# src/components/game/images:
Contains the images which are used for the background-image css attributes for the pieces.
# .css files:
Used for styling components.











