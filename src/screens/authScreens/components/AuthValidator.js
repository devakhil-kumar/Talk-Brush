export const validateForm = ({ isSignup, username, email, password, confirmPassword, phoneNumber,agree}) => {
  const errors = {};

  if (isSignup && (!username || username.trim().length < 4)) {
    errors.username = 'Username must be at least 4 characters long';
  }

  if (!email) {
    errors.email = 'Email is required';
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = 'Enter a valid email address';
  }

  if (phoneNumber && !/^[0-9]{10}$/.test(phoneNumber)) {
    errors.phoneNumber = 'phonenumber atleadt 10 digit'
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (
    !/(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password) ||
    password.length < 6
  ) {
    errors.password ='Password must have at least 1 number, 1 special character, and be at least 6 characters long';
  }

  if(!confirmPassword){
     errors.confirmPassword = 'confirmPassword is required';
  } else if (isSignup && password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

   if (isSignup && !agree) {
    errors.agree = 'You must agree to the privacy policy & terms';
  }

  return errors;
};
