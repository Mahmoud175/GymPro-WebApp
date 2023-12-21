/* eslint-disable no-unused-vars */
const inputs = document.querySelectorAll("w-input");


function generateId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";

  for (let i = 0; i < 24; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters.charAt(randomIndex);
  }

  return id;
}

window.onload = () => {
  var input = document.getElementById("ruserId");
  input.setAttribute("value", generateId());
};




var LoginForm = document.getElementById("email-form");

LoginForm.onsubmit = function doLogin(event) {
    console.log("IN");
  event.preventDefault();

  var emailValue = document.getElementById("email").value;
  var passwordValue = document.getElementById("password").value;

  var endpoint = "/login";

  fetch(endpoint, {
    method: "post",
    body: JSON.stringify({
      email: emailValue,
      password: passwordValue,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error: " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      setSessionCookie("userId", data.userId); 
      if (data.redirect) {
        window.location.href = data.redirect; // Redirect to the specified URL
      }else{
        alert(data.message);
      }
    })
    .catch((error) => {
      console.log(error);
      // Handle any errors
    });
};




// var registerForm = document.querySelectorAll("form")[1];
// registerForm.onsubmit = function doRegister(event) {
//   event.preventDefault();

//   var userId = document.getElementById("ruserId").value;
//   var usernameValue = document.getElementById("rusername").value;
//   var passwordValue = document.getElementById("rpassword").value;
//   var confirmPasswordValue = document.getElementById("confirmPassword").value;
//   var emailValue = document.getElementById("remail").value;
//   var phoneValue = document.getElementById("rphone").value;
//   var addressValue = document.getElementById("raddress").value;

//   var endpoint = "/register";


//  if (passwordValue === confirmPasswordValue) {
//     fetch(endpoint, {
//       method: "post",
//       body: JSON.stringify({
//         userId: userId,
//         username: usernameValue,
//         password: passwordValue,
//         email: emailValue,
//         phoneNumber: phoneValue,
//         address: addressValue,
//       }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Error: " + response.status);
//         }
//         return response.json();
//       })
//       .then((data) => {
//        alert(data.message) ; 
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   } else {
//     alert("The password and confirm password are not the same");
//   }
//   return false;
// };


function setSessionCookie(name, value) {
  document.cookie = name + "=" + (value || "") + "; path=/";
}