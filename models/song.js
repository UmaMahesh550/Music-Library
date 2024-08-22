const mongoose=require('mongoose');

const songSchema = new mongoose.Schema({
    songName:{
        type: String,
        required: true
    },
    singer: {
        type: String,
        required: true
    },
    musicDirector:{
        type: String,
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    albumName: {
        type: String,
        required: true
    },
    artistName:{
        type: String,
        required: true
    },
    isVisible: { 
        type: Boolean, 
        default: true 
    }
})

const Songs= mongoose.model('Songs',songSchema);

module.exports=Songs;