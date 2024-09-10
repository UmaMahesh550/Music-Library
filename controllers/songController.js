const Songs=require('../models/song.js');
const Notifications=require('../models/notification.js');
const Users=require('../models/user.js');

//Retrieve all songs.
exports.getSongs = async (req, res) => {
    try {
        const songs = await Songs.find();
        res.send(songs);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching all songs', error:error.message});
    }
};

//Retrieve all visible songs
exports.getAllVisibleSongs = async (req, res) => {
    try {
        const songs = await Songs.find({isVisible:true});
        if(songs.length===0){
            return res.status(404).send({message:'No songs available'})
        }
        res.send(songs);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching all visible songs', error:error.message});
    }
};

//Retrieve song by id
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
        res.status(500).send({ message: 'Error fetching song by id', error:error.message});
    }
};

//Retrieve song by name
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
        res.status(500).send({ message: 'Error fetching song by name', error:error.message});
    }
};

//Retrieve all songs of a particular music director
exports.getSongByMusicDirector=async(req,res)=>{
    try{
        const musicDirector=req.params.musicDirector;
        const songs = await Songs.find({musicDirector:new RegExp(musicDirector, 'i'), isVisible:true});
        if (songs.length===0){
            return res.status(404).send({ message: 'Songs not found' });
        }
        res.status(200).send(songs);
    }catch(error){
        res.status(500).send({ message: 'Error fetching songs by music director', error:error.message});
    }
};

//Reteieve songs of a particular album
exports.getSongByAlbum=async(req,res)=>{
    try{
        const album=req.params.album;
        const songs = await Songs.find({albumName:new RegExp(album, 'i'), isVisible:true});
        if (songs.length===0){
            return res.status(404).send({ message: 'Songs not found' });
        }
        res.status(200).send(songs);
    }catch(error){
        res.status(500).send({ message: 'Error fetching songs by album', error:error.message});
    }
};

//Retrieve songs of an artist
exports.getSongByArtist=async(req,res)=>{
    try{
        const artist=req.params.artist;
        const songs = await Songs.find({artistName:new RegExp(artist, 'i'), isVisible:true});
        if (songs.length===0){
            return res.status(404).send({ message: 'Songs not found' });
        }
        res.status(200).send(songs);
    }catch(error){
        res.status(500).send({ message: 'Error fetching songs by artist', error:error.message});
    }
};

//Adding song to the library
exports.createSong = async (req, res) => {
    try {
        const song = new Songs(req.body);
        const createdSong=await song.save();

        const users=await Users.find({role:'user'});
        // Create messagea and save notification
        const message = `A new song "${createdSong.songName}" for album "${createdSong.albumName}" has been added to the music library.`;

        // Creating new notification as soon as a new song has been added by the admin
        const notifications=users.map(user=>({
            message:`A new song "${createdSong.songName}" for album "${createdSong.albumName}" has been added to the music library.`,
            userId:user._id
        }))

        await Notifications.insertMany(notifications);
        res.status(200).send(createdSong);
    } catch (error) {
        res.status(500).send({ message: 'Error creating song', error:error.message });
    }
};

//Update song in the library
exports.updateSong = async (req, res) => {
    try {
        const song = await Songs.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!song){
            return res.status(404).send({ message: 'Song not found' });
        }
        res.status(200).send(song);
    } catch (error) {
        res.status(500).send({ message: 'Error updating song', error:error.message});
    }
};

//Delete song from the library
exports.deleteSong = async (req, res) => {
    try {
        const song = await Songs.findByIdAndDelete(req.params.id);
        if (!song){ 
            return res.status(404).send({ message: 'Song not found' });
        }
        res.status(200).send({ message: 'Song deleted' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting song', error:error.message });
    }
};

//Making status of the isVisible field to true i.e making it visible
exports.makeSongVisible = async (req, res) => {
    try {
        const song = await Songs.findByIdAndUpdate(req.params.id,{ isVisible:true },{ new: true });

        if (!song){
            return res.status(404).send({ message: 'Song not found' });
        }
        res.status(200).send({ message: 'Made Song Visible', song });
    } catch (error) {
        res.status(500).send({ message: 'Error making song visible', error:error.message });
    }
};

//Making status of the isVisible field to false i.e making it invisible
exports.makeSongInVisible = async (req, res) => {
    try {
        const song = await Songs.findByIdAndUpdate(req.params.id,{ isVisible:false },{ new: true });

        if (!song){
            return res.status(404).send({ message: 'Song not found' });
        }
        res.status(200).send({ message: 'Made Song Invisible', song });
    } catch (error) {
        res.status(500).send({ message: 'Error making song invisible', error:error.message });
    }
};