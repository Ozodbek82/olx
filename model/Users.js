const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DbUsers = new Schema({
  name: {
    type: String,
    require: true,
  },
  username: String,
  phone: Number,
  email: {
    type: String,
    
  },

  
  password: {
    type: String,
    require: true,
  },
  
});
module.exports = mongoose.model("profile", DbUsers);