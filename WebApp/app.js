/* eslint-disable no-unused-vars */
const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const crypto = require("crypto");
const mongoose = require("mongoose");

const Users = require("./models/customer.js");
const Coaches = require("./models/coach.js");
const Admins = require("./models/admin.js");

const { calculateAge } = require('./models/utils.js');

var CURRENT = null;

const { log } = require("console");

//express app
const app = express();

//connect to DB
// const DBUSR = "mongodb+srv://CEO:admin12345@mood.kkmmia4.mongodb.net/MOOD";
const DBUSR = "mongodb+srv://mahmoudmohsen:12345@cluster0.cyjorup.mongodb.net/test";
mongoose
  .connect(DBUSR, { useNewURLParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("connected");
    app.listen(5556);
  })
  .catch((err) => console.log(err));

//register view engine
app.set("view engine", "ejs");

//static files
app.use(express.static("public"));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.json());

// security

function hashString(inputString) {
  const hash = crypto.createHash("sha256");
  hash.update(inputString);
  const hashedString = hash.digest("hex");
  return hashedString;
}

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

//sessions
app.use(
  session({
    secret: generateId(),
    resave: false,
    saveUninitialized: false,
  })
);

//logs
app.use(morgan("dev"));

//  ------------------/index------------------
app.get("/", (req, res) => {
      res.render("index");
});

//------------------/index------------------
app.get("/index", (req, res) => {
  res.redirect("/");
});

//  ------------------login------------------

app.get("/login", (req, res) => {
  if (!requireLogin(req)) {
    res.redirect("/profile");
  }
  res.render("login");
});

//  ------------------login------------------
app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  found = false;

  await Users.findOne({ email: email, password: password })
    .then((user) => {
      if (user) {
        found = true;
        CURRENT = "customer";
        req.session.user = user;
        res.json({ redirect: "/profile", userId: user.userId});
      } 
    })
    .catch((err) => {
      console.log(err);
      const responseData = { message: "An error occurred" };
      res.json(responseData);
    });
    
    //Search in the coaches collection
    if(!found){
      await Coaches.findOne({ email: email, password: password })
      .then((coach) => {
        if (coach) {
          found = true;
          CURRENT = "coach";
          req.session.user = coach;
          res.json({ redirect: "/profile", userId: coach.userId });
        } 
      })
      .catch((err) => {
        console.log(err);
        const responseData = { message: "An error occurred" };
        res.json(responseData);
      });
    }
    

    //Search in the admins collection
    if(!found){
      await Admins.findOne({ email: email, password: password })
      .then((admin) => {
        if (admin) {
          found = true;
          CURRENT = "admin";
          req.session.user = admin;
          res.json({ redirect: "/profile", userId: admin.userId });
        } 
      })
      .catch((err) => {
        console.log(err);
        const responseData = { message: "An error occurred" };
        res.json(responseData);
      });
    }
    

    //not found
    if(!found){
      const responseData = { message: "Email or Password is Wrong" };
      res.json(responseData);
    }
    
});
       


//  ------------------register------------------
app.get("/signup", (req, res) => {
  if (!requireLogin(req)) {
    res.redirect("/profile");
  }
  res.render("signup");
});


// API endpoint to check if the email exists
app.post("/check-email-exists", async (req, res) => {
  const email = req.body.email;

  try {
      const user = await Users.findOne({ email: email });
      const coach = await Coaches.findOne({ email: email });
      const admin = await Admins.findOne({ email: email });

      const exists = !!user || !!coach || !!admin;

      res.json({ exists: exists });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
  }
});


app.post("/signup",(req,res)=>{
  const user = new Users(req.body);
        user
          .save()
          .then(() => {
            const responseData = { message: "Registration successful"};
            res.json(responseData);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send("Internal Server Error");
          });
});


//-----------------profile----------------------


app.get("/profile", async (req, res) => {
  if (requireLogin(req)) {
    res.redirect("/login");
  } else {
    const userId = req.cookies.userId;

    try {
      let currentUser;
    
      // Search for the user based on userId
      if (CURRENT === "customer") {
        currentUser = await Users.findOne({ userId });
      } else if (CURRENT === "coach") {
        currentUser = await Coaches.findOne({ userId });
      } else {
        currentUser = await Admins.findOne({ userId });
      }
    
      if (currentUser) {
        // Render the appropriate profile page based on the role
        if (CURRENT === "customer") {
          const coachId = currentUser.personalCoach;
          var personalCoach;
          if(coachId != null){
            await Coaches.findById(coachId)
            .then((foundCoach) => {
            // Now, foundCoach.personalCoach will contain the coach's ID
            personalCoach = foundCoach;
            console.log('Found Coach:', foundCoach);
            })
            .catch((err) => {
              console.error('Error while searching for a coach:', err);
            });
          }
          

          
          const membershipData = JSON.parse(currentUser.membershipData);
          console.log(membershipData);
          res.render("profile", { currentUser ,personalCoach, membershipData, calculateAge});

        } else if (CURRENT === "coach") {
          const customersIds = currentUser.assignedCustomers;
          var assignedCustomers = [];

          if (customersIds && customersIds.length > 0) {
            try {
              const foundCustomers = await Users.find({ _id: { $in: customersIds } });
              assignedCustomers.push(...foundCustomers);
              console.log('Found Customers:', foundCustomers);
            } catch (error) {
              console.error('Error while searching for customers:', error);
            }
          }



          res.render("profile-coach", { currentUser , assignedCustomers});
        } else {
          
          try {
            gymCustomers = await Users.find({}).exec();
            // Handle gymCustomers data
          
            gymCoaches = await Coaches.find({}).exec();
            // Handle gymCoaches data
          } catch (err) {
            console.error('Error finding documents:', err);
            // Handle the error appropriately
          }
          console.log(gymCustomers , gymCoaches);

          const personalCoaches = [];

          for (const customer of gymCustomers) {
            try {
              const coachId = customer.personalCoach;
              const personalCoach = await Coaches.findById(coachId);
              personalCoaches.push(personalCoach);
            } catch (error) {
              console.error('Error while fetching personal coach:', error);
            }
          }

          console.log(personalCoaches);

          res.render("profile-admin", { currentUser ,gymCustomers ,personalCoaches , gymCoaches});
        }
      }
    } catch (error) {
      console.error("Error while searching for a user:", error);
      res.render("error");
    }
    
  }
});

//  ------------------/profile/update------------------
app.post("/profile/update", (req, res) => {
  if (requireLogin(req)) {
    res.redirect("/login");
  }

  var conditions = {
    userId: req.body.userId,
  };

  var update = {
    name:{
      firstName: req.body.firstName,
    lastName: req.body.lastName,
    }
    ,
    weight: req.body.weight,
    height: req.body.height,
    goal: req.body.goal,
    phone : req.body.phone,
  }

  Users.findOneAndUpdate(conditions, update).then((updatedUser) => {
    if (updatedUser) {
      const responseData = {
        message: "data updated successfully",
        redirect: "/profile",
      };
      res.json(responseData);
    } else {
      req.session.destroy(() => {
        const responseData = {
          message: "an error happened while updating your data",
          redirect: "/index",
        };
        res.json(responseData);
      });
    }
  });
});

//  ------------------/profile/changepass------------------
app.post("/profile/changepass", (req, res) => {
  var conditions = {
    userId: req.body.userId,
  };

  var update = {
    password: req.body.password,
  };

  Users.findOneAndUpdate(conditions, update).then((updatedUser) => {
    if (updatedUser) {
      const responseData = {
        message: "password updated successfully",
        redirect: "/profile",
      };
      res.json(responseData);
    } else {
      req.session.destroy(() => {
        const responseData = {
          message: "an error happened while updating your password",
          redirect: "/index",
        };
        res.json(responseData);
      });
    }
  });
});

app.post("/profile/changepass/coach", (req, res) => {
  var conditions = {
    userId: req.body.userId,
  };

  var update = {
    password: req.body.password,
  };

  Coaches.findOneAndUpdate(conditions, update).then((updatedUser) => {
    if (updatedUser) {
      const responseData = {
        message: "password updated successfully",
        redirect: "/profile",
      };
      res.json(responseData);
    } else {
      req.session.destroy(() => {
        const responseData = {
          message: "an error happened while updating your password",
          redirect: "/index",
        };
        res.json(responseData);
      });
    }
  });
});

app.post("/profile/changepass/admin", (req, res) => {
  console.log("dsadsadsa")
  var conditions = {
    userId: req.body.userId,
  };

  var update = {
    password: req.body.password,
  };

  Admins.findOneAndUpdate(conditions, update).then((updatedUser) => {
    if (updatedUser) {
      const responseData = {
        message: "password updated successfully",
        redirect: "/profile",
      };
      res.json(responseData);
    } else {
      req.session.destroy(() => {
        const responseData = {
          message: "an error happened while updating your password",
          redirect: "/index",
        };
        res.json(responseData);
      });
    }
  });
});


//  -------------------Admin updates----------------
app.post("/customer/update", async (req, res) => {
  if (requireLogin(req)) {
    res.redirect("/login");
  }

  var conditions = {
    userId: req.body.userId,
  };

  var update = {
    personalCoach: req.body.personalCoach, // Replace with an actual Coach ID
    membershipData: JSON.stringify({
      workoutPlan: []
      ,
      dietPlan: [],
      nextMeeting:{
        meetingDateTime:{
          meetingDate: null,
          meetingtime: null,
        },
        meetingLink: null,
      },
      type: req.body.type,
      sessionsLeft: req.body.sessionsLeft
    })
  };

  var customerId ;

  await Users.findOneAndUpdate(conditions, update).then((updatedUser) => {
    if (updatedUser) {
      customerId = updatedUser._id;
      const responseData = {
        // message: "data updated successfully",
        // redirect: "/profile",
      };
      // res.json(responseData);
    } else {
      req.session.destroy(() => {
        const responseData = {
          message: "an error happened while updating your data",
          redirect: "/index",
        };
        // res.json(responseData);
      });
    }
  });

  const coachId = update.personalCoach 
  // const customerId = conditions.userId 

  // Find the coach and update the assignedCustomers array
  await Coaches.findOneAndUpdate(
    { _id: coachId, assignedCustomers: { $ne: customerId } }, // Check if customerId is not already in the array
    { $addToSet: { assignedCustomers: customerId } },
    { new: true } // This option returns the updated document
  ).then((updatedCoach) => {
    if (updatedCoach) {
      const responseData = {
        message: "Data updated successfully",
        redirect: "/profile",
      };
      res.json(responseData);
    } else {
      const responseData = {
        message: "Customer is already assigned to this coach",
        redirect: "/profile",
      };
      res.json(responseData);
    }
  });
});


app.post('/coach-registration-content', (req, res) => {
  const userType = req.body.user;

  if (userType === 'admin') {
    // res.render('coach-registration', { user: userType });
    const responseData = {
      redirect: "/coach-registration-CexMk0xDMJR2n1Jfp3zVqLTz-administrator",
    };
    res.json(responseData);
  } else {
    res.redirect('/index');
  }
});

app.get("/coach-registration-CexMk0xDMJR2n1Jfp3zVqLTz-administrator",(req,res)=>{
  res.render("coach-registration");
});


app.post("/coach-registration", async (req, res) => {
  try {
    const user = new Coaches(req.body);
    await user.save();
    
    const responseData = { message: "Coach registration successful", redirect: '/profile' };
    console.log(responseData);
    res.json(responseData);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyValue) {
      // Duplicate key error (assuming 'email' is the unique field)
      const responseData = { message: "Email already exists. Please choose a different email." };
      console.log(responseData);
      res.json(responseData);
    } else {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
});





// -------------------coach---------------
app.get("/workout-plan-dsadsad-CexMk0xDMJR2n1Jfp3zVqLasdsadsaTz-dsadsadsacoach",(req,res)=>{

  if (requireLogin(req)) {
    res.redirect("/login");
  }
  const userId = req.query.userId;
  console.log(userId);
  res.render("customer-workout-plan",{userId});
});

app.post("/customer/createWorkoutPlan", async (req, res) => {
  if (requireLogin(req)) {
    res.redirect("/login");
  }

  const conditions = {
    userId: req.body.userId,
  };

  // Retrieve the existing document
  const existingUser = await Users.findOne(conditions);

  if (existingUser) {
    // Parse the membershipData string
    const parsedMembershipData = JSON.parse(existingUser.membershipData);

    // Update the parsed object with the new workoutPlan
    parsedMembershipData.workoutPlan = req.body.workoutPlan;

    // Update the document with the modified membershipData
    const update = {
      $set: {
        'membershipData': JSON.stringify(parsedMembershipData),
      },
    };

    const updatedUser = await Users.findOneAndUpdate(conditions, update, { new: true });

    if (updatedUser) {
      // Document updated successfully
      const responseData = {
        message: "Workout plan created successfully",
        redirect: "/profile",
      };
      res.json(responseData);
    } else {
      // Handle the case where the update failed
      const responseData = {
        message: "An error happened while updating your data",
        redirect: "/index",
      };
      res.json(responseData);
    }
  } else {
    // Handle the case where the user is not found
    const responseData = {
      message: "User not found",
      redirect: "/index",
    };
    res.json(responseData);
  }
});


app.get("/diet-plan-dsadsad-CexMk0xDMJR2n1Jfp3zVqLasdsadsaTz-dsadsadsacoach",(req,res)=>{
  if (requireLogin(req)) {
    res.redirect("/login");
  }
  const userId = req.query.userId;
    console.log(userId);
  res.render("customer-diet-plan",{userId});
});

app.post("/customer/createDietPlan", async (req, res) => {
  if (requireLogin(req)) {
    res.redirect("/login");
  }

  const conditions = {
    userId: req.body.userId,
  };

  // Retrieve the existing document
  const existingUser = await Users.findOne(conditions);

  if (existingUser) {
    // Parse the membershipData string
    const parsedMembershipData = JSON.parse(existingUser.membershipData);

    // Update the parsed object with the new workoutPlan
    parsedMembershipData.dietPlan = req.body.dietPlan;

    // Update the document with the modified membershipData
    const update = {
      $set: {
        'membershipData': JSON.stringify(parsedMembershipData),
      },
    };

    const updatedUser = await Users.findOneAndUpdate(conditions, update, { new: true });

    if (updatedUser) {
      // Document updated successfully
      const responseData = {
        message: "Diet plan created successfully",
        redirect: "/profile",
      };
      res.json(responseData);
    } else {
      // Handle the case where the update failed
      const responseData = {
        message: "An error happened while updating your data",
        redirect: "/index",
      };
      res.json(responseData);
    }
  } else {
    // Handle the case where the user is not found
    const responseData = {
      message: "User not found",
      redirect: "/index",
    };
    res.json(responseData);
  }
});

app.get("/schedule-session-dsadsad-CexMk0xDMJR2n1Jfp3zVqLasdsadsaTz-dsadsadsacoach",async (req,res)=>{
  if (requireLogin(req)) {
    res.redirect("/login");
  }
  const userId = req.cookies.userId;
  try{
    currentUser = await Coaches.findOne({ userId });

  const customersIds = currentUser.assignedCustomers;
          var assignedCustomers = [];

          if (customersIds && customersIds.length > 0) {
            try {
              const foundCustomers = await Users.find({ _id: { $in: customersIds } });
              assignedCustomers.push(...foundCustomers);
              // console.log('Found Customers:', foundCustomers);
            } catch (error) {
              console.error('Error while searching for customers:', error);
            }
          }
          // console.log('Customers:  ',assignedCustomers);
  
  res.render("schedule-session" , {assignedCustomers});
  }
  catch (error) {
    console.error("Error while searching for a user:", error);
    res.render("error");
  }
  
});


app.post("/customer/schedule-session", async (req, res) => {
  if (requireLogin(req)) {
    res.redirect("/login");
  }

  const conditions = {
    userId: req.body.userId,
  };
  
  // Retrieve the existing document
  const existingUser = await Users.findOne(conditions);
  
  if (existingUser) {
    // Parse the membershipData string
    const parsedMembershipData = JSON.parse(existingUser.membershipData);
  
    // Update the parsed object
    parsedMembershipData.nextMeeting = {
      meetingDateTime: {
        meetingDate: req.body.meetingDate,
        meetingtime: req.body.meetingtime,
      },
      meetingLink: req.body.meetingLink,
    };
  
    // Update the document with the modified membershipData
    const update = {
      $set: {
        'membershipData': JSON.stringify(parsedMembershipData),
      },
    };
  
    const updatedUser = await Users.findOneAndUpdate(conditions, update, { new: true });
  
    if (updatedUser) {
      // Document updated successfully
      const responseData = {
        message: "Scheduled successfully",
        redirect: "/profile",
      };
      res.json(responseData);
    } else {
      // Handle the case where the update failed
      const responseData = {
        message: "An error happened while updating your data",
        redirect: "/index",
      };
      res.json(responseData);
    }
  } else {
    // Handle the case where the user is not found
    const responseData = {
      message: "User not found",
      redirect: "/index",
    };
    res.json(responseData);
  }
});



// -----------------community-------------

app.get("/community",(req,res)=>{
  res.render('community');
});


// -----------------membership-------------

app.get("/membership", (req, res) => {
  res.render("membership");
});


//  ------------------/logout------------------
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("userId");
    res.redirect("/login");
  });
});

//  ------------------404------------------
app.use((req, res) => {
  res.status(404).render("404", { title: "404 - Not Found" });
});

function requireLogin(req) {
  if (!req.session.user) {
    return true;
  } else {
    return false;
  }
}