const mongoose = require('mongoose');
const {Schema}  = mongoose;

const EventSchema = new Schema({
    organizer: {type:mongoose.Schema.ObjectId, ref:'User'},
    title: String,
    description: String,
    address: String,
    photo:[String],
    timeStart: String,
    timeEnd: String,
    maxPeople: Number,
    date: Date,
    badge: { type: mongoose.Schema.ObjectId, ref: 'Badge', default: null },
});


const EventModel = mongoose.model('Event', EventSchema);


module.exports = EventModel;