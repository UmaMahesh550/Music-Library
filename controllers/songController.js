const Songs=require('../models/song.js');
const Users=require('../models/user.js');
const Notifications=require('../models/notification.js')

exports.getSongs = async (req, res) => {
    try {
        const songs = await Songs.find();
        res.send(songs);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching all songs', error});
    }
};

exports.getAllVisibleSongs = async (req, res) => {
    try {
        const songs = await Songs.find({isVisible:true});
        if(songs.length===0){
            return res.status(404).send({message:'No songs available'})
        }
        res.send(songs);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching all visible songs', error});
    }
};

exports.getSongById = async (req, res) => {
    try {
        const song = await Songs.findById(req.params.id);
        if (!song){
            return res.status(404).send({ message: 'Song not found' });
        }
        if(song.isVisible===false){
            return res.status(404).send({ message: 'Song not visible' });
        }
        res.status(200).send(song);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching song by id', error});
    }
};

exports.getSongByName=async(req,res)=>{
    try{
        const songName=req.params.songName;
        const song = await Songs.findOne({songName:new RegExp(songName, 'i')});
        if (!song){
            return res.status(404).send({ message: 'Song not found' });
        }
        if(song.isVisible===false){
            return res.status(404).send({ message: 'Song not visible' });
        }
        res.status(200).send(song);
    }catch(error){
        res.status(500).send({ message: 'Error fetching song by name', error});
    }
};

exports.getSongByMusicDirector=async(req,res)=>{
    try{
        const musicDirector=req.params.musicDirector;
        const songs = await Songs.find({musicDirector:new RegExp(musicDirector, 'i'), isVisible:true});
        if (songs.length===0){
            return res.status(404).send({ message: 'Songs not found' });
        }
        res.status(200).send(songs);
    }catch(error){
        res.status(500).send({ message: 'Error fetching songs by music director', error});
    }
};

exports.getSongByAlbum=async(req,res)=>{
    try{
        const album=req.params.album;
        const songs = await Songs.find({albumName:new RegExp(album, 'i'), isVisible:true});
        if (songs.length===0){
            return res.status(404).send({ message: 'Songs not found' });
        }
        res.status(200).send(songs);
    }catch(error){
        res.status(500).send({ message: 'Error fetching songs by album', error});
    }
};

exports.getSongByArtist=async(req,res)=>{
    try{
        const artist=req.params.artist;
        const songs = await Songs.find({artistName:new RegExp(artist, 'i'), isVisible:true});
        if (songs.length===0){
            return res.status(404).send({ message: 'Songs not found' });
        }
        res.status(200).send(songs);
    }catch(error){
        res.status(500).send({ message: 'Error fetching songs by artist', error});
    }
};

exports.createSong = async (req, res) => {
    try {
        const song = new Songs(req.body);
        const createdSong=await song.save();
        res.status(200).send(createdSong);
    } catch (error) {
        res.status(500).send({ message: 'Error creating song', error });
    }
};

exports.updateSong = async (req, res) => {
    try {
        const song = await Songs.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!song){
            return res.status(404).send({ message: 'Song not found' });
        }
        res.status(200).send(song);
    } catch (error) {
        res.status(500).send({ message: 'Error updating song', error});
    }
};

exports.deleteSong = async (req, res) => {
    try {
        const song = await Songs.findByIdAndDelete(req.params.id);
        if (!song){ 
            return res.status(404).send({ message: 'Song not found' });
        }
        res.status(200).send({ message: 'Song deleted' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting song', error });
    }
};

exports.makeSongVisible = async (req, res) => {
    try {
        const song = await Songs.findByIdAndUpdate(req.params.id,{ isVisible:true },{ new: true });

        if (!song){
            return res.status(404).send({ message: 'Song not found' });
        }
        res.status(200).send({ message: 'Made Song Visible', song });
    } catch (error) {
        res.status(500).send({ message: 'Error making song visible', error });
    }
};

exports.makeSongInVisible = async (req, res) => {
    try {
        const song = await Songs.findByIdAndUpdate(req.params.id,{ isVisible:false },{ new: true });

        if (!song){
            return res.status(404).send({ message: 'Song not found' });
        }
        res.status(200).send({ message: 'Made Song Invisible', song });
    } catch (error) {
        res.status(500).send({ message: 'Error making song invisible', error });
    }
};