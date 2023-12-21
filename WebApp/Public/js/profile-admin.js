$(document).ready(function(){
    $(".w-webflow-badge").removeClass("w-webflow-badge").empty();
    });

    var buttons = document.querySelectorAll('.account-button');

    function copContainer(containerId) {
        buttons.forEach(function(button) {
            button.classList.remove('clicked');
        });

        var targetButton = document.querySelector('#cop');
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

    function coContainer(containerId) {
        buttons.forEach(function(button) {
            button.classList.remove('clicked');
        });

        var targetButton = document.querySelector('#co');
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

    var endpoint = "/profile/changepass/admin";

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


    let isChangeMembershipActive = false;

    function selectCustomer(element) {
        if (isChangeMembershipActive) {
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
        const addSessionBtn = document.getElementById("addSessionBtn");
        const assignCoachBtn = document.getElementById("assignCoachBtn");
    
        // Toggle the buttons based on the border color
        const displayValue = borderColor === 'transparent' ? 'none' : 'inline-block';
        addSessionBtn.style.display = displayValue;
        assignCoachBtn.style.display = displayValue;
      }



      function editCustomer(gymCoachesJson) {

        const gymCoaches = JSON.parse(gymCoachesJson);

        console.log(gymCoaches);

        const selectedDiv = document.querySelector('.selected');
        if (!selectedDiv) {
          console.error('No customer div is selected.');
          return;
        }
        isChangeMembershipActive = true;
        const userId = selectedDiv.getAttribute('key');
        const membershipLi = document.querySelector(`.membership.${userId}`);
        if (!membershipLi) {
          console.error('Membership li not found.');
          return;
        }
    
        membershipLi.innerHTML = `
          Membership: 
          <select id="${userId}-membership-select">
            <option value="Premium">Premium</option>
            <option value="GymRat">GymRat</option>
          </select>
          
        `;

        const personalCoachLi = document.querySelector(`.personalCoach.${userId}`);
        if (!personalCoachLi) {
            console.error('Personal Coach li not found.');
            return;
        }


        const coachSelector = document.createElement('select');
        coachSelector.id = `${userId}-coach-select`;

        // Add options for each coach in the gymCoaches array
        gymCoaches.forEach((coach) => {
            const option = document.createElement('option');
            option.value = coach._id;
            option.text = coach.name.firstName + " "+ coach.name.lastName;
            coachSelector.appendChild(option);
        });
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.onclick = () => saveCustomer(userId);

        personalCoachLi.innerHTML = 'Personal Coach: ';
        personalCoachLi.appendChild(coachSelector);

        selectedDiv.appendChild(saveButton)

      }
    
      function saveCustomer(userId) {
        const membershipSelect = document.getElementById(`${userId}-membership-select`);
        if (!membershipSelect) {
          console.error(`Membership select not found for user ${userId}.`);
          return;
        }
      
        const selectedMembership = membershipSelect.value;

        console.log(`User ${userId} selected membership: ${selectedMembership}`);

        const coachSelect = document.getElementById(`${userId}-coach-select`);
        if (!membershipSelect) {
          console.error(`Membership select not found for user ${userId}.`);
          return;
        }
      
        const selectedCoach = coachSelect.value;

        console.log(`User ${userId} selected membership: ${selectedCoach}`);
      
        var endpoint = "/customer/update";

        var sessionsLeft;

        if(selectedMembership==='Premium'){
            sessionsLeft = 2;
        }
        else{
            sessionsLeft = 4;
        }
    
        fetch(endpoint, {
          method: "post",
          body: JSON.stringify({
            userId: userId,
            personalCoach: selectedCoach,
            type: selectedMembership,
            sessionsLeft: sessionsLeft,
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







      
        // If you want to hide the dropdown and button after saving, you can reset the HTML
        const membershipLi = document.querySelector(`.membership.${userId}`);
        if (membershipLi) {
          membershipLi.innerHTML = `Membership: ${selectedMembership}`;
        }
      }


    document.getElementById('addCoachButton').addEventListener('click', function() {
        // const windowWidth = 500;
        // const windowHeight = 600;
        // const left = (window.screen.availWidth - windowWidth) / 2;
        // const top = (window.screen.availHeight - windowHeight) / 2;
      
        const userData = {
            user: 'admin'
          };
          
          fetch('/coach-registration-content', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
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
              return data;
            })
            .then((data) => {
              if (data.redirect) {
                window.location.href = data.redirect;
              }
            })
            .catch((error) => {
              console.log(error);
            });
          

        // fetch(endpoint, {
        //     method: "post",
        //     body: JSON.stringify({
        //       userId: userId,
        //       personalCoach: selectedCoach,
        //       type: selectedMembership,
        //       sessionsLeft: sessionsLeft,
        //     }),
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //   })
        //     .then((response) => {
        //       if (!response.ok) {
        //         throw new Error("Error: " + response.status);
        //       }
        //       return response.json();
        //     })
        //     .then((data) => {
        //       if (data.message) {
        //         alert(data.message);
        //       } 
        //       return data
        //     }).then((data)=>{
        //       if (data.redirect) {
        //         window.location.href = data.redirect;
        //       }
        //     })
        //     .catch((error) => {
        //       console.log(error);
        //     });

      });
      
      