export default function LoginValidation(values) {
 
    let error = {}; // obj to hold validation errors
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //check if email is empty
    if (values.email === "") {
        error.email = "Email should not be empty";
    }
    else if (!email_pattern.test(values.email)) {
        error.email = "Email didn't match";
    }
    else {
        error.email = ""; // No error for email
    }

    //check if password is empty
    if (values.password === "") {
        error.password = "Password should not be empty";
    }
  
  
    else {
        error.password = "";
    }

    return error;
}