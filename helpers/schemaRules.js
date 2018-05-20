
module.exports = {
  schema: {
    email: {
      isEmail: true,
      errorMessage: 'Valid email requested',
      trim: {
        // Options as an array
        options: [[" ", "-"]],
      },
      normalizeEmail: {
        all_lowercase: true
      }
    },
    password: {
      isLength: {
        errorMessage: 'Should be at least 8 chars long',
        options: { min: 8 }
      },
      trim: {
        // Options as an array
        options: [[" ", "-"]],
      },
      escape: true
    }
  }
};