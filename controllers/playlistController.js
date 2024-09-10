const Playlists=require('../models/playlist.js');

//Retrieve all playlists created by every user.
exports.getAllPlaylists = async (req, res) => {
    try {
        const playlists = await Playlists.find();
        res.status(200).send(playlists);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching all playlists' });
    }
};

//Retrieve playlists created by a particular user
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

//Retrieve playlist by id created by a particular user
exports.getPlaylistById = async (req, res) => {
    try {
        const playlist = await Playlists.findById(req.params.id);
        if (!playlist) {
            return res.status(404).send({ message: 'Playlist not found' });
        }
        if(playlist.userId.toString() !== req.user.id.toString()){
            return res.status(404).send({ message: 'Not authorized to retrieve this playlist' });
        }
        res.status(200).send(playlist);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching playlist by id' });
    }
};

//Create Playlist
exports.createPlaylist = async (req, res) => {
    try {
        const name=req.body.name;
        const playlist=await Playlists.findOne({name});
        if(playlist){
            return res.status(201).send({message:`Playlist with that name already exists`});
        }
        const newPlaylist = new Playlists({
             name:name, 
             userId: req.user.id,
             songs:[]
            });
        await newPlaylist.save();
        res.status(200).send({message:'Playlist created..',newPlaylist});
    } catch (error) {
        res.status(500).send({ message: 'Error creating playlist',error:error.message });
    }
};

//Update playlist created by a particular user
exports.updatePlaylist = async (req, res) => {
    try {
        const name=req.body.name;
        const playlist=await Playlists.findById(req.params.id);
        if(!playlist){
            return res.status(404).send({ message: 'Playlist not found' });
        }
        if(playlist.userId.toString() !== req.user.id.toString()){
            return res.status(404).send({ message: 'Not authorized to update this playlist' });
        }
        const Dbplaylist=await Playlists.findOne({name});
        if(Dbplaylist){
            return res.status(201).send({message:`Playlist with that name already exists`});
        }
        
        
        const updatedPlaylist = await Playlists.findByIdAndUpdate(req.params.id, {name:req.body.name}, { new: true });
        res.status(200).send({message:'Playlist updated successfully...'});
    } catch (error) {
        res.status(500).send({ message: 'Error updating playlist',error });
    }
};

//Delete playlist created by a particular user
exports.deletePlaylist = async (req, res) => {
    try {
        const playlist=await Playlists.findById(req.params.id);
        if(!playlist){
            return res.status(404).send({ message: 'Playlist not found' });
        }
        if(playlist.userId.toString() !== req.user.id.toString()){
            return res.status(404).send({ message: 'Not authorized to delete this playlist' });
        }
        await Playlists.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Playlist deleted' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting playlist..',error });
    }
};

//Adding only visible songs to the playlist created by a particular user
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
            return res.status(404).send({ message: 'Not authorized to  this playlist' });
        }

        const uniqueSongIds = [...new Set([...playlist.songs, ...songIdsArray])];

        playlist.songs = uniqueSongIds;
        
        await playlist.save();

        res.status(200).send({message:`Song added to playlist ${playlist.name} succuessfully...`});
    } catch (error) {
        res.status(500).send({ message: 'Error adding songs to playlist:', error: error.message });
    }
};

//Retrieve all songs in a playlist..
exports.getAllSongsInPlaylist=async(req,res)=>{
    try{
        const playlist=await Playlists.findById(req.params.id).populate('songs');
        if(!playlist){
            return res.status(404).send({ message: 'Playlist not found' });
        }
        if(playlist.userId.toString() !== req.user.id.toString()){
            return res.status(404).send({ message: 'Not authorized to fetch this playlist' });
        }
        const songs=playlist.songs.filter(song=>(song.isVisible===true));
        res.status(200).send(songs);
    }catch(error){
        res.status(500).send({ message: 'Error fetching songs in playlist..',error });
    }
};

//Remove song from playlist.
exports.removeSongFromPlaylist = async (req, res) => {
    try {
        const playlistId = req.params.id;
        const songId=req.params.songId;

        const playlist = await Playlists.findById(playlistId);
        if (!playlist){ 
            return res.status(404).send({ message: 'Playlist not found' });
        }
        if(playlist.userId.toString() !== req.user.id.toString()){
            return res.status(404).send({ message: 'Not authorized to  this playlist' });
        }
        playlist.songs.pull(songId);
        await playlist.save();

        res.send({message:'Song deleted from playlist successfully'});
    } catch (error) {
        console.error('Error removing song from playlist:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//Retrieve song by id from playlist.
exports.getSongByIdFromPlaylist = async (req, res) => {
    try {
        const playlistId= req.params.id;
        const songId=req.params.songId;

        const playlist = await Playlists.findById(playlistId).populate('songs');
        if (!playlist) {
            return res.status(404).send({ message: 'Playlist not found' });
        }
        if(playlist.userId.toString() !== req.user.id.toString()){
            return res.status(404).send({ message: 'Not authorized to  this playlist' });
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

//Retrieve songs by name in playlist
exports.getSongsByNameInPlaylist = async (req, res) => {
    try {
        const playlistId = req.params.id;
        const songName=req.params.songName;

        const playlist = await Playlists.findById(playlistId).populate('songs');
        if (!playlist) {
            return res.status(404).send({ message: 'Playlist not found' });
        }
        if(playlist.userId.toString() !== req.user.id.toString()){
            return res.status(404).send({ message: 'Not authorized to  this playlist' });
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