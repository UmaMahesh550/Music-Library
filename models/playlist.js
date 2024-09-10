const mongoose = require('mongoose');

//Playlist schema definition
const playlistSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Users', 
        required: true
    },
    songs:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Songs'
    }]
})

const Playlists=mongoose.model('Playlists',playlistSchema);

module.exports=Playlists;