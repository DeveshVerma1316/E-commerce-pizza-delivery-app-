const mongoose = require ('mongoose');
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true, "First Name is required"],
        minlength:[5,"First Name must be 5 character long"],
        lowerase:true,
        trim: true, //if the user gives extra spaces then it will automatically remove it
        maxlength:[20, "First name should be less then or eual to 20 characters"]

    },
    lastName:{
        type:String,
        required:[true, "Last Name is required"],
        minlength:[5,"last Name must be 5 character long"],
        lowerase:true,
        trim: true, //if the user gives extra spaces then it will automatically remove it
        maxlength:[20, "last name should be less then or eual to 20 characters"]
    },
    mobilenumber:{
        type:String,
        trim:true,
        maxlength:[10,"Phone number should be of length 10"],
        maxlength:[10,"Phone number should be of length 10"],
        unique:[true,"Phone number is already in use "],
        required:[true, "Phone number should be provided"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password:{
        type:String,
        required:[true,"Password should be provided"],
        minlength:[6, "Password should be minimum 6 charatcter long"]
    }
},{
    timestamps:true
});
const User = mongoose.model("User", userSchema);

module.exports = User;
