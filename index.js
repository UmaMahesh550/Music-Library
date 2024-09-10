const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const cors= require('cors');
const dotenv=require('dotenv');
const Users=require('./routes/userRoutes.js');
const Songs=require('./routes/songRoutes.js');
const Playlists=require('./routes/playlistRoutes.js');
const Notifications=require('./routes/notificationRoutes.js')

dotenv.config(); //Configuring the environment variables defined in .env file

const app=express();
const PORT= process.env.PORT || 5000; //PORT number saved in .env file
let corsOptions={
    origin:'http://localhost:3000', //Front end running host
    methods: ['GET','PUT','POST','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
}

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})

app.use(bodyParser.json()); //body parser is used to retrieve data sent as a body format in a request
app.use(cors(corsOptions)); //cors used to have a secured connection between two servers

//Connecting mongo database through atlas platform
mongoose.connect(process.env.MONGODB_URI) //Mongo db uri 
.then(()=>{
    console.log("Connected to MongoDB");
}).catch((error)=>{
    console.error({message:'Error connecting to Mongo Data Base'},error.message);
})
const db=mongoose.connection;
db.on('error',console.error.bind(console, 'Mongo DB connection error'));

app.use('/api/users',Users); //Should use the defined path before paths defined in their respective routes
app.use('/api/songs',Songs);
app.use('/api/playlists',Playlists);
app.use('/api/notifications',Notifications);