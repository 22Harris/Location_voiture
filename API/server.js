const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const userRoute = require('./routes/userRoute');
app.use('api/user', userRoute);
const carRoute = require('./routes/carRoute');
app.use('api/car', carRoute);
const reservationRoute = require('./routes/reservationRoute');
app.use('api/reservation', reservationRoute);

const DBconnect = async()=> {
    const localURI = 'mongodb://localhost:27017/Car_location';

    try{
        await mongoose.connect(localURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected at DB Local');
    }catch(err){
        console.log(err);
    }
}
DBconnect();

app.listen(4000, ()=>{
    console.log(`Listen to 4000`);
})