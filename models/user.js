const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  method: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    require: true
  },
  local: {
    email: {
      type: String,
      lowercase: true
    },
    password: {
      type: String
    }
  },
  google: {
    id: {
      type: String
    },
    name: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  },
  facebook: {
    id: {
      type: String
    },
    name: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  }
});

UserSchema.pre('save', async function (next) {
  try {
    if (this.method !== 'local') {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.local.password, salt);
    this.local.password = hashedPassword;
    next();
  }
  catch (error) {
    next(error);
  }
});

UserSchema.methods.verifyPassword = async function (loginPassword) {
  try {
    return await bcrypt.compare(loginPassword, this.local.password);
  }
  catch (error) {
    throw new Error(error);
  }
}

const User = mongoose.model('User', UserSchema);

module.exports = User;