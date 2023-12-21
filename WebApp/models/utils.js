function calculateAge(birthdate) {
    const currentDate = new Date();
    const birthDate = new Date(birthdate);
  
    // Calculate the difference in milliseconds
    const timeDiff = currentDate - birthDate;
  
    // Calculate the age in years
    const age = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365.25));
  
    return age;
  }
  
  module.exports = {
    calculateAge,
  };