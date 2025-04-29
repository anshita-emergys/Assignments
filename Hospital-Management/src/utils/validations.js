export const validationRules = {
    first_name: {
      required: "First name is required",
      minLength: {
        value: 3,
        message: "First name must be at least 3 characters",
      },
      pattern: {
        value: /^[a-zA-Z]+$/,
        message: "Invalid name",
      },
    },
    last_name: {
      required: "Last name is required",
      minLength: {
        value: 3,
        message: "Last name must be at least 3 characters",
      },
      pattern: {
        value: /^[a-zA-Z]+$/,
        message: "Invalid name",
      },
    },
    email: {
      required: "Email is required",
      pattern: {
        value: /^(DR|AMD)\d+|^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
    },
    mobile_number: {
      required: "Contact number is required",
      minLength: {
        value: 10,
        message: "Contact number must be 10 digits",
      },
      pattern: {
        value: /^\d{10}$/i,
        message: "Invalid contact number",
      },
    },
    user_password: {
      required: "Password is required",
      minLength: {
        value: 4,
        message: "Password must be at least 4 characters",
      },
    },
    disease_type: {
      required: "Disease type is required",
      minLength: {
        value: 3,
        message: "Disease type must be at least 3 characters",
      },
      pattern: {
        value: /^[A-Za-z]+( [A-Za-z]+)*$/,
        message: "Invalid disease type format",
      },
    },
    father_name: {
      required: "Father's name is required",
      minLength: {
        value: 3,
        message: "Father's name must be at least 3 characters",
      },
      pattern: {
        value: /^[A-Za-z]+( [A-Za-z]+)?$/,
        message: "Invalid Name",
      },
    },
    father_age: {
      required: "Father's age is required",
      pattern: {
        value: /^\d{1,3}$/,
        message: "Please enter a valid age",
      },
    },
    mother_name: {
      required: "Mother's name is required",
      minLength: {
        value: 3,
        message: "Mother's name must be at least 3 characters",
      },
      pattern: {
        value: /^[A-Za-z]+( [A-Za-z]+)?$/,
        message: "Invalid Name",
      },
    },
    mother_age: {
      required: "Mother's age is required",
      pattern: {
        value: /^\d{1,3}$/,
        message: "Please enter a valid age",
      },
    },
    patient_name: {
      required: "Patient name is required",
      minLength: {
        value: 3,
        message: "Patient name must be at least 3 characters",
      },
      pattern: {
        value: /^[A-Za-z]+( [A-Za-z]+)?$/,
        message: "Invalid Name",
      },
    },
    weight: {
      required: "Weight is required",
      min: 0,
      pattern: {
        value: /^\d{1,3}$/,
        message: "Please enter a valid number (e.g. 50)",
      },
    },
    height: {
      required: "Height is required",
      min: 0,
      pattern: {
        value: /^\d+(\.\d+)?$/,
        message: "Please enter a valid number (e.g. 5.2)",
      },
    },
    specialization:{
      required: "Specialization is required",
      
    }
  };