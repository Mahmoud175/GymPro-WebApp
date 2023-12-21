$(document).ready(function(){
  $(".w-webflow-badge").removeClass("w-webflow-badge").empty();
});


$(document).ready(function () {
    $("#check").click(function () {

        if (!validateFields()) {
                alert("Please fill in all required fields correctly.");
                return;
            }
        var email = $("#name-2").val();

        // Assume you have an API endpoint for checking if the email exists
        $.ajax({
            url: "/check-email-exists",
            method: "POST",
            data: { email: email },
            success: function (response) {
                if (response.exists) {
                    // Email doesn't exist, handle accordingly
                    alert("Email already exist.");
                } else {
                    // Email exists, hide div-block-4 and show info-div-block

                    $(".info-div-block").css({marginLeft: "0"});


                    $(".div-block-4").css("visibility", "hidden").animate({ marginLeft: "-100" }, 10);

                    $(".info-div-block").css("visibility", "visible");

                }
            },
            error: function (error) {
                console.log(error);
            },
        });
    });
});

$(document).ready(function () {
    $(".back").click(function () {
        $(".info-div-block").css({marginLeft: "504"});

        $(".div-block-4").css("visibility", "visible").animate({ marginLeft: "0" }, 10);

        $(".info-div-block").css("visibility", "hidden");
    });
});


$(document).ready(function () {
$(".Submition").click(function (event) {
  event.preventDefault();

  // Collect data from form inputs
  var userId = document.getElementById("ruserId").value;
  var firstName = $("#name").val();
  var lastName = $("#name-4").val();
  var email = $("#name-2").val();
  var password = $("#Passowrd").val();
  var dateOfBirth = $("#name-8").val();
  var weight = $("#name-5").val();
  var height = $("#name-6").val();
  var gender = $("#Gender").val();
  var goal = $("#Goal").val();
  var phone = $("#name-7").val();
  var personalCoach = null;
  var membershipData = null;

  // Validate weight and height inputs
  if (!isValidWeight(weight) || !isValidHeight(height)) {
    alert("Please enter a realistic weight and height.");
    return;
  }

  // Validate phone number
  if (!isValidPhoneNumber(phone)) {
    alert("Please enter a valid phone number.");
    return;
  }

  // Prepare data to send to the backend
  var userData = {
    userId: userId,
    name:{
        firstName: firstName,
        lastName: lastName
    },
    email: email,
    password: password,
    phone: "+2"+phone,
    dateOfBirth: dateOfBirth,
    weight: weight,
    height: height,
    gender: gender,
    goal: goal,
  };

  // Assume you have a backend endpoint for creating user accounts
  $.ajax({
    url: "/signup",
    method: "POST",
    data: userData,
    success: function (response) {
      // Handle success response from the backend
      console.log(response);
      alert("User account created successfully!");

      window.location.href = '/login';
    },
    error: function (error) {
      // Handle error response from the backend
      console.log(error);
      alert("Error creating user account. Please try again.");
    },
  });
});

// Helper function to validate weight
function isValidWeight(weight) {
  // Assuming weight should be between 30 and 500 kg
  return !isNaN(weight) && weight >= 30 && weight <= 500;
}

// Helper function to validate height
function isValidHeight(height) {
  // Assuming height should be between 50 and 250 cm
  return !isNaN(height) && height >= 50 && height <= 250;
}

// Helper function to validate phone number
function isValidPhoneNumber(phone) {
  // Assuming phone number should start with '010', '011', '012', or '015' and be 11 digits long
  var phoneRegex = /^(010|011|012|015)\d{8}$/;
  return phoneRegex.test(phone);
}
});


// Helper function to validate fields
function validateFields() {
var firstName = $("#name").val();
var lastName = $("#name-4").val();
var email = $("#name-2").val();
var password = $("#Passowrd").val();

if (firstName && lastName && isValidEmail(email) && password) {
  return true;
} else {
  return false;
}
}

// Helper function to validate email
function isValidEmail(email) {
// Use a regular expression for basic email validation
var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return emailRegex.test(email);
};


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



document.addEventListener('DOMContentLoaded', function () {
// Initialize flatpickr with datetime picker options
flatpickr("#datetimePicker", {
    enableTime: true, // Enable time picker
    dateFormat: "Y-m-d h:i K", // Date and time format
});
});