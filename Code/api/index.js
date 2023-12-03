const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('./models/User.js');
const EventParticipants = require('./models/EventParticipants.js');
const Event = require('./models/Event.js');
const Badge = require('./models/Badge.js');
const UserBadges = require('./models/UserBadges.js');
const jwt = require('jsonwebtoken');
const app = express();
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');



const bcryptSalt = bcrypt.genSaltSync(10);

const jwtSecret = "sdhshdhasdasdasdasdasd";

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use('/badges', express.static(__dirname+'/badges'));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));


mongoose.connect(process.env.MONGO_URL);


app.get('/test', (req, res) => {
    res.json('test ok');
});


app.post('/register', async (req, res) =>{
    const {name,email,password} = req.body;

    try{
        const userDoc = await User.create({
            name,
            email,
            password:bcrypt.hashSync(password, bcryptSalt),
        });
    
        res.json(userDoc);
    } catch (e) {
        res.status(422).json(e);
    }
    
});

app.post('/login', async function(req, res) {
    const {email, password} = req.body;

    const userDoc =  await User.findOne({email});
    if (userDoc) {
        const passok = bcrypt.compareSync(password, userDoc.password);
        if (passok) {
            jwt.sign({email: userDoc.email, id: userDoc._id}, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc);
            });     
        } else {
            res.status(422).json('pass not ok');
        }
        
    } else {
        res.json('not found');
    }


});


app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const {name, email, _id} = await User.findById(userData.id);
            res.json({name, email, _id});
        });
    } else {
        res.json(null);
    }
    
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
});

const photosMiddleware = multer({dest:'uploads'});
app.post('/uploadphoto', photosMiddleware.array('photos', 100), (req,res) =>{
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const {path, originalname} = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploadphoto/', ''));
    }
    res.json(uploadedFiles);
});

const badgeMiddleware = multer({dest:'badges'});
app.post('/uploadbadge', badgeMiddleware.array('badges', 100), (req,res) =>{
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const {path, originalname} = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploadbadge/', ''));
    }
    res.json(uploadedFiles);
});

app.post('/badges', (req, res)=>{
    const {token} = req.cookies;
    const {
        title, addedPhoto, description, date,
    } = req.body;

    const formattedDate = new Date(date).toISOString().split('T')[0];
 
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const badgeDoc = await Badge.create({
            organizer:userData.id, title, photo:addedPhoto, description, date:formattedDate,
        });
    res.json(badgeDoc);
   });
})


app.post('/events', (req, res)=>{
    const {token} = req.cookies;
    const {
        title,address, addedPhoto, badgeId,
        timeStart, timeEnd, maxPeople, description, date,
    } = req.body;
   

    const formattedDate = new Date(date).toISOString().split('T')[0];
 
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const eventDoc = await Event.create({
            organizer:userData.id, title,address, photo:addedPhoto, badge:badgeId,
            timeStart, timeEnd, maxPeople, description, date:formattedDate,
        });
    res.json(eventDoc);
   });
})


app.get('/userEvents', (req, res)=>{
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const {id} = userData;
        res.json(await Event.find({organizer:id}));
    });

});

app.get('/userBadges', (req, res)=>{
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const {id} = userData;
        res.json(await Badge.find({organizer:id}));
    });

});


app.get('/badgepage/edit/:id', async (req, res) => {
    const {id} = req.params;
    res.json(await Badge.findById(id));
});

app.get('/badgepage/:id', async (req, res) => {
    const {id} = req.params;
    res.json(await Badge.findById(id));
});

app.put('/badges', async (req, res) => {
    const {token} = req.cookies;
    const {
        id, title, addedPhoto, description, date,
    } = req.body;
    
    const formattedDate = new Date(date).toISOString().split('T')[0];

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const badgeDoc = await Badge.findById(id);
        if (userData.id === badgeDoc.organizer.toString()) {
            
            badgeDoc.set({
                title, photo:addedPhoto, description, date:formattedDate,
            });
            await badgeDoc.save();
            res.json('ok');
        }
    });

});

app.get('/eventpage/edit/:id', async (req, res) => {
    const {id} = req.params;
    res.json(await Event.findById(id));
});

app.get('/eventpage/:id', async (req, res) => {
    const {id} = req.params;
    res.json(await Event.findById(id));
});

app.get('/badge/:badgeId', async (req, res) => {
    try {
        const badge = await Badge.findById(req.params.badgeId);
        res.json(badge);
    } catch (error) {
        res.status(500).send(error);
    }
});


app.put('/events', async (req, res) => {
    const {token} = req.cookies;
    const {
        id, title,address, addedPhoto, badgeId,
        timeStart, timeEnd, maxPeople, description, date,
    } = req.body;
    
    const formattedDate = new Date(date).toISOString().split('T')[0];

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const eventDoc = await Event.findById(id);
        if (userData.id === eventDoc.organizer.toString()) {
            
            eventDoc.set({
                title,address, photo:addedPhoto, badge:badgeId,
                timeStart, timeEnd, maxPeople, description, date:formattedDate,
            });
            await eventDoc.save();
            res.json('ok');
        }
    });

});

app.get('/Badges', async (req, res) => {
    res.json(await Badge.find());
});

app.get('/events', async (req, res) => {
    res.json(await Event.find());
});


app.post('/joins', async (req, res) => {
    const { event, user } = req.body;

    try {
        const existingParticipant = await EventParticipants.findOne({ event, user });
        if (existingParticipant) {
            return res.status(409).send({ message: "User already registered for this event" });
        }

        await EventParticipants.create({ event, user });

        const eventDetails = await Event.findById(event);
        if (eventDetails && eventDetails.badge) {
            await UserBadges.create({ user, badge: eventDetails.badge });
        }

        res.status(201).send({ message: "Participant added successfully" });
    } catch (err) {
        res.status(500).send({ message: "Error processing request", err });
    }
});





app.get('/user-events/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const participantEntries = await EventParticipants.find({ user: userId }).populate('event');

        const events = participantEntries.map(entry => entry.event);
        res.status(200).json(events);
    } catch (err) {
        res.status(500).send({ message: "Error fetching events", err });
    }
});

app.get('/user-badges/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        // Assuming you have a model that relates users to their earned badges
        const userBadges = await UserBadges.find({ user: userId }).populate('badge');
        res.json(userBadges);
    } catch (error) {
        console.error('Error fetching user badges:', error);
        res.status(500).send({ message: "Error processing request", error });
    }
});



app.listen(4000);