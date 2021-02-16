const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DbMessage = new Schema({
  reader_name:{
    type:String,
  },
  writer_name:{
    type:String,
  },
  reader_id: {
    type: String,
    },
  writer_id: {
    type: String,    
  },
  message:{
    type:String,
    
  } ,
  date_message: {
    type: Date,
    default: Date.now,
  }
  
});
module.exports = mongoose.model("messages", DbMessage);