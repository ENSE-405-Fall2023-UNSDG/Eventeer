const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserBadgesSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    badge: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge', required: true },
    earnedDate: { type: Date, default: Date.now }
});

const UserBadges = mongoose.model('UserBadges', UserBadgesSchema);

module.exports = UserBadges;
