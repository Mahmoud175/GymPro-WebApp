$(document).ready(function(){
    $(".w-webflow-badge").removeClass("w-webflow-badge").empty();
    });

    var buttons = document.querySelectorAll('.account-button');

    function piContainer(containerId) {
        buttons.forEach(function(button) {
            button.classList.remove('clicked');
        });

        var targetButton = document.querySelector('#pi');
        targetButton.classList.add('clicked');

        // Hide all containers
        document.querySelectorAll('.w-layout-blockcontainer').forEach(function(container) {
        container.style.display = 'none';
        });

        // Show the selected container
        const selectedContainer = document.getElementById(containerId);
        if (selectedContainer) {
        selectedContainer.style.display = 'block';
        }
    } 

    function tpContainer(containerId) {
        buttons.forEach(function(button) {
            button.classList.remove('clicked');
        });

        var targetButton = document.querySelector('#tp');
        targetButton.classList.add('clicked');

        // Hide all containers
        document.querySelectorAll('.w-layout-blockcontainer').forEach(function(container) {
        container.style.display = 'none';
        });

        // Show the selected container
        const selectedContainer = document.getElementById(containerId);
        if (selectedContainer) {
        selectedContainer.style.display = 'block';
        }
    }  

    function cpContainer(containerId) {
        buttons.forEach(function(button) {
            button.classList.remove('clicked');
        });
        
        var targetButton = document.querySelector('#cp');
        targetButton.classList.add('clicked');

        // Hide all containers
        document.querySelectorAll('.w-layout-blockcontainer').forEach(function(container) {
        container.style.display = 'none';
        });

        // Show the selected container
        const selectedContainer = document.getElementById(containerId);
        if (selectedContainer) {
        selectedContainer.style.display = 'block';
        }
    }   



    function getCookie(cookieName) {
        const name = cookieName + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(";");

        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === " ") {
            cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
            }
        }

        return null; 
    }


    var updatePasswordForm = document.getElementById("email-form-2");

    updatePasswordForm.onsubmit = function doChangePassword(event) {

        console.log("Changing");

    event.preventDefault();

    var userIdValue = getCookie('userId') ; 
    var passwordValue = document.getElementById("password").value;
    var confirmPasswordValue = document.getElementById("confirmPassword").value;

    var endpoint = "/profile/changepass";

    if (passwordValue === confirmPasswordValue) {
                fetch(endpoint, {
                method: "post",
                body: JSON.stringify({
                    userId: userIdValue,
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
                    if (data.message) {
                    alert(data.message);
                    } 
                    return data
                }).then((data)=>{
                    if (data.redirect) {
                    window.location.href = data.redirect;
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            } else {
                alert("password are not the same ! " ) ; 
            }

            return false ; 
        };

    function logOut(){
        return confirm('Are you sure you want to log out?')
    }



    function profileUpdate(event) {
    
      event.preventDefault();

      var infoFields = document.querySelectorAll('.text-block-2');
    //   var infoFields2 = document.querySelectorAll('.text-block');
      

      console.log(infoFields);
    
      var firstNameValue = infoFields[0].value;
      var lastNameValue = infoFields[1].value;
    //   var emailValue = infoFields[2].value;
      var phoneValue  = infoFields[3].value;
      var goalValue = infoFields[4].value;
      var weightValue  = infoFields[5].value;
      var heightValue  = infoFields[6].value;

    //   console.log(infoFields2);
    //   var genderValue = infoFields2[0].value;


        console.log(firstNameValue);
        console.log(lastNameValue);
        console.log(phoneValue);
        console.log(goalValue);
        console.log(weightValue);
        console.log(heightValue);



    //   var goalField = document.querySelector('.goal');
    //   var goalValue = goalField.textContent;

      var userIdValue =  getCookie('userId');
      
    
    
      var endpoint = "/profile/update";
    
        fetch(endpoint, {
          method: "post",
          body: JSON.stringify({
            userId: userIdValue,
            firstName: firstNameValue,
            lastName: lastNameValue,
            // email: emailValue,
            weight: weightValue,
            height: heightValue,
            // gender: genderValue,
            goal: goalValue,
            phone : phoneValue
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
            if (data.message) {
              alert(data.message);
            } 
            return data
          }).then((data)=>{
            if (data.redirect) {
              window.location.href = data.redirect;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      
     return false ; 
    };










    function toggleInfoFields() {
        var infoFields = document.querySelectorAll('.info-div');
    
        infoFields.forEach(function (field) {
            var textBlock = field.querySelector('.text-block-2');
            if (textBlock) {
                if(!textBlock.classList.contains('EMAIL')){
                    if(!textBlock.classList.contains('AGE')){
                    var inputOrSelect = createInput(textBlock.textContent, textBlock);
    
                // Replace the text block with the input or select
                    field.replaceChild(inputOrSelect, textBlock);
                }
            }
                
            }
        });
    
        toggleInfoFields2();
    
        // Disable the "Change Info" button after clicking
        // document.getElementById('changeInfoBtn').setAttribute('disabled', 'true');
        document.getElementById('changeInfoBtn').style.display = 'none';
        document.getElementById('confirm').style.display = 'inline-block';

    }
    
    function toggleInfoFields2() {
        var infoFields = document.querySelectorAll('.info-div');
    
        infoFields.forEach(function (field) {
            var textBlock = field.querySelector('.text-block');
            if (textBlock) {
                if(!textBlock.classList.contains('gender')){
                    var inputOrSelect = createSelect(textBlock.textContent, textBlock);
    
                // Replace the text block with the input or select
                    field.replaceChild(inputOrSelect, textBlock);
                }
                
            }
        });
    }
    
    function createInput(value , conatiner) {
        // Create a new input or select element
        
            var input = document.createElement('input');
            // For select element
            // var inputOrSelect = document.createElement('select');
        
            // Set common attributes
            input.setAttribute('class', 'text-block-2');
            input.setAttribute('value', value);
        
            return input;
        
        
    }
    
    function createSelect(value, container) {
        // Create a new input or select element
        
        // For select element
        // var inputOrSelect = document.createElement('select');
        
            var select = document.createElement('select');
            var goalOptions = ['Gain Weight', 'Maintain Weight', 'Lose Weight'];

            for (var i = 0; i < goalOptions.length; i++) {
                var option = document.createElement('option');
                option.value = goalOptions[i];
                option.text = goalOptions[i];
    
                // Set the selected attribute for the current value
                if (goalOptions[i].toLowerCase() === value.toLowerCase()) {
                    option.setAttribute('selected', 'selected');
                }
    
                // Append the option to the select element
                select.appendChild(option);
            }
            // Set common attributes
            select.setAttribute('class', 'text-block-2');
            select.setAttribute('value', value);
            return select;

        
    
    }
    




    


    