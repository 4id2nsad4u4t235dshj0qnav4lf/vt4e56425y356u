import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";

// Firebase configuration
  const firebaseConfig = {

    apiKey: "AIzaSyB6WY0j6q-IvSaVt7xLTkrirCzejzPaR9Y",

    authDomain: "gauchoguys.firebaseapp.com",

    projectId: "gauchoguys",

    storageBucket: "gauchoguys.firebasestorage.app",

    messagingSenderId: "804879622098",

    appId: "1:804879622098:web:f9b739131f74fe0657720b"

  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);


const apiurl = "https://web-production-5f62.up.railway.app"




// Set local persistence to keep user signed in across sessions
function signin() {
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      return signInWithPopup(auth, provider);
    })
    .then((result) => {
      const user = result.user;
      userId = user.uid;
      userEmail = user.email
      localStorage.setItem('userEmail', userEmail); 
      userName = user.displayName;

      //const userDiv = document.getElementById('user');
      const googleLoginBtn = document.getElementById('google-login-btn');
      //googleLoginBtn.style.display = 'none';

     // const userNameSpan = document.createElement('span');
      //userNameSpan.textContent = userName;
      //userDiv.replaceChildren(userNameSpan);



                 fetch(apiurl+'/register', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    uid: userId,
                    name: name
                  }),
                })
                  .then(response => response.json())
                  .then(data => {
                    console.log('User added to Firestore:', data);
                  })
                  .catch(error => {
                    console.error('Error adding user to Firestore:', error);
                  });




    })
    .catch((error) => {
      console.error("Error signing in:", error);
    });
}






onAuthStateChanged(auth, (user) => {
  if (user) {
    userId = user.uid;
    userName = user.displayName;
    userEmail = user.email;
    localStorage.setItem('userEmail', userEmail); 

    const userDiv = document.getElementById('user');
    const googleLoginBtn = document.getElementById('google-login-btn');
    googleLoginBtn.innerHTML = user.email;
    googleLoginBtn.style.textDecoration = "none";
    googleLoginBtn.style.color = "black";

    displaypaymentlink(user.email);

    // Get 'name' parameter from URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlName = urlParams.get('name'); // Extract name from URL

    if (urlName) {
      // Call the register API to update the name
      fetch(apiurl+'/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: userId,
          name: urlName, // Use the name from the URL
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('User updated with URL name:', data);
        })
        .catch(error => {
          console.error('Error updating user with URL name:', error);
        });
    }
  }
});


// Event listener for the login button
const googleLogin = document.getElementById("google-login-btn");
googleLogin.addEventListener("click", function() {
  signin();
});



















