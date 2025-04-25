export const isPasswordValid = (password: string): boolean => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
    
    if (password.length < minLength) {
      return false;
    }
    
    const strength = [hasUppercase, hasLowercase, hasNumbers, hasSpecialChars]
      .filter(Boolean).length;
    
    return strength >= 3;
  }

export const isEmailValid = (email: string): boolean => {
    return email.includes('@') && email.includes('.com');
  }

export const isPhoneNumberValid = (phoneNumber: string): boolean => {
  if (!phoneNumber) {
    return false; 
  }
    const length = phoneNumber.length;
    return length >= 9 && length <= 13;
  }