export const validateForm = ({
  isSignup = false,    
  isUserEdit = false,  
  isLogin=false, 
  username,
  email,
  password,
  confirmPassword,
  phoneNumber,
  agree
}) => {
  const errors = {};

  if ((isSignup || isUserEdit) && (!username || username.trim().length < 3)) {
    errors.username = 'FullName must be at least 3 characters long';
  }

  if (!email) {
    errors.email = 'Email is required';
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = 'Enter a valid email address';
  }

  if ((isSignup || isUserEdit) && phoneNumber && !/^[0-9]{10}$/.test(phoneNumber)) {
    errors.phoneNumber = 'Phone number must be 10 digits';
  }

  if (isSignup) {
    if (!password) {
      errors.password = 'Password is required';
    } else if (
      !/(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password) ||
      password.length < 6
    ) {
      errors.password =
        'Password must have at least 1 number, 1 special character, and be at least 6 characters long';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm password is required';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!agree) {
      errors.agree = 'Please accept the Terms & Conditions and Privacy Policy.';
    }
  }

 if (isLogin) {
    if (!password) {
      errors.password = 'Password is required';
    }
  }


  return errors;
};
