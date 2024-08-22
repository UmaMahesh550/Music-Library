const Playlists=require('../models/playlist.js');
const Songs=require('../models/song.js');

exports.getAllPlaylists = async (req, res) => {
    try {
        const playlists = await Playlists.find();
        res.status(200).send(playlists);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching all playlists' });
    }
};

exports.getAllPlaylistsOfUser = async(req,res)=>{
    try{
        const id=req.user.id;
        const playlists = await Playlists.find({userId:id});
        if(playlists.length===0){
            return res.status(404).send({ message: 'Playlists not found' });
        }
        res.status(200).send(playlists);
    }catch(error){
        res.status(500).send({ message: 'Error fetching playlists of user',error});
    }
};

exports.getPlaylistById = async (req, res) => {
    try {
        const playlist = await Playlists.findById(req.params.id);
        if (!playlist) {
            return res.status(404).send({ message: 'Playlist not found' });
        }
        if(playlist.userId.toString() !== req.user.id.toString()){
            res.status(404).send({ message: 'Not authorized to retrieve this playlist' });
        }
        res.status(200).send(playlist);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching playlist by id' });
    }
};

exports.createPlaylist = async (req, res) => {
    try {
        const newPlaylist = new Playlists({
             ...req.body, 
             userId: req.user.id 
            });
        await newPlaylist.save();
        res.status(200).send({message:'Playlist created..',newPlaylist});
    } catch (error) {
        res.status(500).send({ message: 'Error creating playlist',error });
    }
};

exports.updatePlaylist = async (req, res) => {
    try {
        const playlist=await Playlists.findById(req,params.id);
        if(!playlist){
            res.status(404).send({ message: 'Playlist not found' });
        }
        if(playlist.userId.toString() !== req.user.id.toString()){
            res.status(404).send({ message: 'Not authorized to update this playlist' });
        }
        const updatedPlaylist = await Playlists.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send(updatedPlaylist);
    } catch (error) {
        res.status(500).send({ message: 'Error updating playlist',error });
    }
};

exports.deletePlaylist = async (req, res) => {
    try {
        const playlist=await Playlists.findById(req,params.id);
        if(!playlist){
            res.status(404).send({ message: 'Playlist not found' });
        }
        if(playlist.userId.toString() !== req.user.id.toString()){
            res.status(404).send({ message: 'Not authorized to delete this playlist' });
        }
        await Playlists.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Playlist deleted' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting playlist..',error });
    }
};

exports.addSongsToPlaylist = async (req, res) => {
    try {

        const playlistId = req.params.id;
        const { songIds } = req.body;

        const songIdsArray = Array.isArray(songIds) ? songIds : [songIds];

        const playlist = await Playlists.findById(playlistId);
        if (!playlist) {
            return res.status(404).send({ message: 'Playlist not found' });
        }
        if(playlist.userId.toString() !== req.user.id.toString()){
            res.status(404).send({ message: 'Not authorized to  this playlist' });
        }

        const validSongs = await Songs.find({ _id: { $in: songIdsArray }, visible: true });

        if (validSongs.length === 0) {
            return res.status(400).send({ message: 'No valid visible songs to add' });
        }

        const validSongIds = validSongs.map(song => song._id.toString());

        const uniqueSongIds = [...new Set([...playlist.songs, ...validSongIds])];

        playlist.songs = uniqueSongIds;
        
        await playlist.save();

        res.status(200).send(playlist);
    } catch (error) {
        res.status(500).send({ message: 'Error adding songs to playlist:', error: error.message });
    }
};


exports.getAllSongsInPlaylist=async(req,res)=>{
    try{
        const playlist=await Playlists.findById(req.params.id).populate('songs');
        if(!playlist){
            res.status(404).send({ message: 'Playlist not found' });
        }
        if(playlist.userId.toString() !== req.user.id.toString()){
            res.status(404).send({ message: 'Not authorized to fetch this playlist' });
        }
        const songs=playlist.songs;
        
        res.status(200).send(songs);
    }catch(error){
        res.status(500).send({ message: 'Error fetching songs in playlist..',error });
    }
};


exports.removeSongFromPlaylist = async (req, res) => {
    try {
        const playlistId = req.params.id;
        const songId=req.params.songId;

        const playlist = await Playlists.findById(playlistId);
        if (!playlist){ 
            return res.status(404).send({ message: 'Playlist not found' });
        }
        if(playlist.userId.toString() !== req.user.id.toString()){
            res.status(404).send({ message: 'Not authorized to  this playlist' });
        }
        playlist.songs.pull(songId);
        await playlist.save();

        res.send({message:'Song deleted from playlist successfully'});
    } catch (error) {
        console.error('Error removing song from playlist:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.getSongByIdFromPlaylist = async (req, res) => {
    try {
        const playlistId= req.params.id;
        const songId=req.params.songId;

        const playlist = await Playlists.findById(playlistId).populate('songs');
        if (!playlist) {
            return res.status(404).send({ message: 'Playlist not found' });
        }
        if(playlist.userId.toString() !== req.user.id.toString()){
            res.status(404).send({ message: 'Not authorized to  this playlist' });
        }
        
        const song = playlist.songs.find(song => song._id.toString() === songId);
        if (!song) {
            return res.status(404).send({ message: 'Song not found in playlist' });
        }

        res.json(song);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving song from playlist:', error: error.message });
    }
};



exports.getSongsByNameInPlaylist = async (req, res) => {
    try {
        const playlistId = req.params.id;
        const songName=req.params.songName;

        const playlist = await Playlists.findById(playlistId).populate('songs');
        if (!playlist) {
            return res.status(404).send({ message: 'Playlist not found' });
        }
        if(playlist.userId.toString() !== req.user.id.toString()){
            res.status(404).send({ message: 'Not authorized to  this playlist' });
        }

        const songs = playlist.songs.filter(song => 
            song.songName.toLowerCase().includes(songName.toLowerCase())
        );

        if (songs.length === 0) {
            return res.status(404).send({ message: 'No songs found with the specified name' });
        }

        const visibleSongs=songs.filter(song=>song.isVisible===true);

        res.send(visibleSongs);
    } catch (error) {
        res.status(500).json({ message: 'Error finding songs by name in playlist:', error: error.message });
    }
};