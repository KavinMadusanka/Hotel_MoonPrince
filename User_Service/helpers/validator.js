import fs from 'fs';

//email validator
export const emailValidator = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

//password validator
export const passwordValidator = (password) => {
    // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

//text validator
export const textValidator = (text) => {
    const textRegex = /^[A-Za-z\s]+$/;
    return textRegex.test(text);
}

//description validator
export const descriptionValidator = (description) => {
    const descriptionRegex = /^[A-Za-z0-9\s.,!?'"-]+$/;
    return descriptionRegex.test(description);
}

// Contact number validator for Sri Lanka (+94XXXXXXXXX)
export const contactNumberValidator = (contactNumber) => {
  const contactNumberRegex = /^\+947\d{8}$/;
  return contactNumberRegex.test(contactNumber);
};

//remove images
export const removeImage = (imagePath) => {
    if (imagePath) {
        fs.unlinkSync(imagePath);
    }
}