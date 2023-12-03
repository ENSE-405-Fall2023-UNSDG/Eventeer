const mongoose = require('mongoose');
const {Schema}  = mongoose;

const EventParticipantsSchema = new Schema({

    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    

});


const EventParticipantsModel = mongoose.model('EventParticipants', EventParticipantsSchema);


module.exports = EventParticipantsModel;