import {isEmpty} from './isEmpty.js';


export const validateNewUserInput = (data) => {
    let errors = {};

    data.email = data.email ? data.email : "";
    data.name = data.name ? data.name : "";
    data.lastName = data.lastName ? data.lastName : "";
    data.password = data.password ? data.password : "";
    

    if(isEmpty(data.email)){
        errors.email = "Email field is required";
    }

    if(isEmpty(data.name)){
        errors.name = "Name field is required";
    }

    if(isEmpty(data.lastName)){
        errors.lastName = "Last name field is required";
    }

    if(isEmpty(data.password)){
        errors.password = "Password field is required";
    }

    return {
      errors,
      isValid: isEmpty(errors)
    }
}

export const validateLoginInput = (data) => {
    let errors = {};

    data.email = data.email ? data.email : "";
    data.name = data.name ? data.name : "";

    
    if(isEmpty(data.email)){
        errors.email = "Email field is required";
    }

    if(isEmpty(data.password)){
        errors.password = "Password field is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}