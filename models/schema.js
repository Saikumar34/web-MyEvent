var mongoose = require("mongoose");

var UserSchema = mongoose.Schema({
    firstname:{
        type     :  String,
        required :  true
    },
    lastname:{
        type     :   String,
        required :   true
    },
    email:{
        type     :   String,
        unique   :   true,
        required :   true
    },
    password:{
        type     :   String,
        required :   true
    }
});
var Users   =  mongoose.model('Users',UserSchema);

var RegisterSchema  =   mongoose.Schema({
    email:{
        type     :   String,
        required :   true
    },
    code:{
        type    :   String,
        required:   true
    }
});
RegisterSchema.index({ email: 1, code: 1}, { unique: true });
var Register    =   mongoose.model('Register',RegisterSchema);

var  EventsSchema   =   mongoose.Schema({
    code:{
        type    :   String,
        unique  :   true,
        required:   true
    },
    name:{
        type    :   String,
        required:   true 
    },
    imgname:{
        type   :   String,
        required:   true
    },
    caption:{
        type    :   String
    },
    description:{
        type    :   String
    }
});
var Events  =   mongoose.model('Events',EventsSchema);

module.exports = {
    Users     :   Users,
    Register  :   Register,
    Events    :   Events
};
