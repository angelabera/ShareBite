const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL);

const userSchema = mongoose.Schema({
    name: {
        type:String,
        required: String,
        trim: true
    },
    email: {
        type:String,
        required: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type:String,
        required: String
    },
    role: {
        type: String,
        enum: ["donor", "collector"], 
        required: true
  }
})

module.exports = mongoose.model("user", userSchema);