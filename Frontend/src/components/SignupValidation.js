export default function SignupValidation(formData) {
 
    let error = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Nmae validation
    if (formData.name === "") {
        error.name = "Name should not be empty";
    }
  
    else {
        error.name = "";
    }
// Email validation
    if (formData.email === "") {
        error.email = "Email should not be empty";
    }
    else if (!email_pattern.test(formData.email)) {
        error.email = "Email didn't match";
    }
    else {
        error.email = "";
    }
    // Password validation
    if (formData.password === "") {
        error.password = "Password should not be empty";
    }
  
    else {
        error.password = "";
    }

    return error;
}