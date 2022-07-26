import {isEmpty} from './isEmpty.js';

export const validateStudentInput = (data) => {
    let errors = {};
    
    data.name = data.name ? data.name : "";
    data.lastName = data.lastName ? data.lastName : "";

    if(isEmpty(data.name)) {
        errors.name = "Name field is required";
    }

    if(isEmpty(data.lastName)) {
        errors.lastName = "Lastname field is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
