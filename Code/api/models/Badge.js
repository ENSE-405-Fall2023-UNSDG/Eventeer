const mongoose = require('mongoose');
const {Schema}  = mongoose;

const BadgeSchema = new Schema({
    organizer: {type:mongoose.Schema.ObjectId, ref:'User'},
    title: String,
    description: String,
    photo:[String],
    date: Date,

});


const BadgeModel = mongoose.model('Badge', BadgeSchema);


module.exports = BadgeModel;