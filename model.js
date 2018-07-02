
import mongoose from 'mongoose';


const connstring = 'mongodb://localhost:27017/wechat';

mongoose.connect(connstring);



var User = new mongoose.Schema({
    id: Number,  
    wechatid: String,
    name: String
});


var Sign = new mongoose.Schema({
    id: Number,  
    name: String,
    time: String,
});

var Student = new mongoose.Schema({
    id: Number,  
    name: String,
});




module.exports.User = mongoose.model('User', User);
module.exports.Sign = mongoose.model('Sign', Sign);
module.exports.Student = mongoose.model('Student', Student);