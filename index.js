const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const cors= require('cors');
const dotenv=require('dotenv');
const Users=require('./routes/userRoutes.js');
const Songs=require('./routes/songRoutes.js');
const Playlists=require('./routes/playlistRoutes.js');

dotenv.config();

const app=express();
const PORT= process.env.PORT || 5000;
let corsOptions={
    origin:'http://localhost:3000',
    methods: ['GET','PUT','POST','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
}

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})

app.use(bodyParser.json());
app.use(cors(corsOptions));

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.error('Error connecting to MongoDB',err);
})
const db=mongoose.connection;
db.on('error',console.error.bind(console, 'Mongo DB connectin error'));

app.use('/api/users',Users);
app.use('/api/songs',Songs);
app.use('/api/playlists',Playlists);