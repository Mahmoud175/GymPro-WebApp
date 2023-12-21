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

    function seContainer(containerId) {
        buttons.forEach(function(button) {
            button.classList.remove('clicked');
        });

        var targetButton = document.querySelector('#se');
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

    function cuContainer(containerId) {
        buttons.forEach(function(button) {
            button.classList.remove('clicked');
        });

        var targetButton = document.querySelector('#cu');
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

    var endpoint = "/profile/changepass/coach";

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

    let isEditing = false;


    function selectCustomer(element) {
        if (isEditing) {
            // If "Change Membership" is active, do not toggle the borders
            return;
          }
        // Toggle the "selected" class
        const borderColor = element.style.borderColor === 'transparent' ? '#402E32' : 'transparent';
        const divs = document.querySelectorAll('.customer-div');
            divs.forEach((div) => {
            div.style.borderColor = 'transparent'; // Reset all div borders
            div.classList.remove('selected');
        });
        element.style.borderColor = borderColor;

        if (!element.classList.contains('selected')) {
            element.classList.add('selected');
        }
    
        // Get the buttons
        const editWorkoutPlan = document.getElementById("editWorkoutPlan");
        const editDietPlan = document.getElementById("editDietPlan");
        const scheduleSession = document.getElementById("scheduleSession");
    
        // Toggle the buttons based on the border color
        const displayValue = borderColor === 'transparent' ? 'none' : 'inline-block';
        editWorkoutPlan.style.display = displayValue;
        editDietPlan.style.display = displayValue;
        scheduleSession.style.display = displayValue;
      }



      function selectSession(element) {
        if (isEditing) {
            // If "Change Membership" is active, do not toggle the borders
            return;
          }
        // Toggle the "selected" class
        const borderColor = element.style.borderColor === 'transparent' ? '#402E32' : 'transparent';
        const divs = document.querySelectorAll('.session');
          console.log(divs);

            divs.forEach((div) => {
            div.style.borderColor = 'transparent'; // Reset all div borders
            div.classList.remove('selected');
        });
        element.style.borderColor = borderColor;

        if (!element.classList.contains('selected')) {
            element.classList.add('selected');
        }
    
        // Get the buttons
        const editMeetingLink = document.getElementById("editMeetingLink");
        // const assignCoachBtn = document.getElementById("assignCoachBtn");
    
        // Toggle the buttons based on the border color
        const displayValue = borderColor === 'transparent' ? 'none' : 'inline-block';
        // addSessionBtn.style.display = displayValue;
        editMeetingLink.style.display = displayValue;
      }


      // Function to edit the workout plan
function editWorkoutPlan() {
    const selectedCustomer = document.querySelector('.selected');
    if (selectedCustomer) {
        const selectedKey = selectedCustomer.getAttribute('key');
        // Use the selectedKey in the URL or perform other actions
        console.log(selectedKey)

        const userData = {
            userId: selectedKey
          };
        
        const queryString = Object.keys(userData).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(userData[key])}`).join('&');

        window.location.href = `/workout-plan-dsadsad-CexMk0xDMJR2n1Jfp3zVqLasdsadsaTz-dsadsadsacoach?${queryString}`;
    }
}

// Function to edit the diet plan
function editDietPlan() {
    const selectedCustomer = document.querySelector('.customer-div.selected');
    if (selectedCustomer) {
        const selectedKey = selectedCustomer.getAttribute('key');
        // Use the selectedKey in the URL or perform other actions
        const userData = {
            userId: selectedKey
          };
        
        const queryString = Object.keys(userData).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(userData[key])}`).join('&');

        window.location.href = `/diet-plan-dsadsad-CexMk0xDMJR2n1Jfp3zVqLasdsadsaTz-dsadsadsacoach?${queryString}`;
    }
}



function editLink(assignedCustomersJson) {
    const assignedCustomers = JSON.parse(assignedCustomersJson);

    console.log(assignedCustomersJson);
  
    assignedCustomers.forEach((customer, index) => {
      const sessionDiv = document.createElement('div');
      sessionDiv.className = 'session';
      sessionDiv.style = 'cursor: pointer; border: 2px solid transparent; width: auto;';
  
      const h4 = document.createElement('h4');
      h4.textContent = `Session ${index + 1}: ${customer.name.firstName} ${customer.name.lastName}`;
      sessionDiv.appendChild(h4);
  
      const meetingDateDiv = document.createElement('div');
      meetingDateDiv.textContent = `Meeting Date: ${JSON.parse(customer.membershipData).nextMeeting.meetingDateTime.meetingDate} ${JSON.parse(customer.membershipData).nextMeeting.meetingDateTime.meetingtime}`;
      sessionDiv.appendChild(meetingDateDiv);
  
      const meetingLinkDiv = document.createElement('div');
      const meetingLinkValue = JSON.parse(customer.membershipData).nextMeeting.meetingLink;
      meetingLinkDiv.textContent = `Meeting Link: ${meetingLinkValue ? meetingLinkValue : 'No Link Yet'}`;
      sessionDiv.appendChild(meetingLinkDiv);
  
      const editLinkButton = document.createElement('button');
      editLinkButton.textContent = 'Edit Link';
      editLinkButton.onclick = () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = meetingLinkValue ? meetingLinkValue : '';
        meetingLinkDiv.innerHTML = '';
        meetingLinkDiv.appendChild(input);
  
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.onclick = () => saveMeetingLink(customer, input.value);
        meetingLinkDiv.appendChild(saveButton);
      };
      sessionDiv.appendChild(editLinkButton);
  
      document.querySelector('.sessions').appendChild(sessionDiv);
    });
  }
  
  function saveMeetingLink(customer, newMeetingLink) {
    // Perform the logic to save the new meeting link, e.g., send it to the server
    console.log('Saving Meeting Link:', newMeetingLink);
  
    // Update the UI with the new meeting link
    const meetingLinkDiv = document.querySelector('.session div:nth-child(3)');
    meetingLinkDiv.textContent = `Meeting Link: ${newMeetingLink}`;
  }
  