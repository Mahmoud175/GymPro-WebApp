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


  function doRegister(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the form data
    const formData = new FormData(document.forms["myForm"]);
    const email = formData.get("email");

    // Make an AJAX request to check if the email exists
    fetch("/check-email-exists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.exists) {
          alert("Email already exists!");
        } else {
          // Proceed with the form submission or other actions
          document.forms["myForm"].submit();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

var registerForm = document.getElementById("form");
registerForm.onsubmit = function doRegister(event) {
  event.preventDefault();

  var userId = document.getElementById("ruserId").value;
  var firstNameValue = document.getElementById("firstName").value;
  var lastNameValue = document.getElementById("lastName").value;
  var emailValue = document.getElementById("email").value;
  var phoneValue = document.getElementById("phone").value;
  var passwordValue = document.getElementById("password").value;

  var endpoint = "/coach-registration";


  fetch(endpoint, {
    method: "post",
    body: JSON.stringify({
      userId: userId,
      name: {
        firstName: firstNameValue,
        lastName: lastNameValue,
      },
      password: passwordValue,
      email: emailValue,
      phone: phoneValue,
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
      alert(data.message);
  
      // Check if there's a redirect URL in the response data
      if (data.redirect) {
        // Redirect to the specified URL
        window.location.href = data.redirect;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return false;
};