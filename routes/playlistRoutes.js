const express= require('express');
const router=express.Router();

const {getAllPlaylists, getAllPlaylistsOfUser, getPlaylistById, createPlaylist,
    updatePlaylist,deletePlaylist,getAllSongsInPlaylist,
    addSongsToPlaylist,removeSongFromPlaylist,getSongByIdFromPlaylist,
    getSongsByNameInPlaylist
}= require('../controllers/playlistController.js');

const{protect,admin}=require('../middleware/authMiddleware.js');

router.get('/',protect,admin,getAllPlaylists);//route to fetch all playlists by the admin
router.get('/user',protect,getAllPlaylistsOfUser);//route to fetch all palylists of the user
router.get('/id/:id',protect,getPlaylistById);//route to fetch playlist by id
router.post('/playlist',protect,createPlaylist);//route to create playlist  by the user
router.put('/playlist/:id',protect,updatePlaylist);//route to update playlist by the particular user
router.delete('/playlist/:id',protect,deletePlaylist);//route to delete playlist by the user

router.get('/playlist/songs/:id',protect,getAllSongsInPlaylist);//route to get all songs in a playlist
router.post('/:id/songs', protect,addSongsToPlaylist); //route to add songs to the playlist
router.delete('/:id/songs/:songId',protect,removeSongFromPlaylist); //route to remove song from the palylist
router.get('/:id/songs/:songId',protect,getSongByIdFromPlaylist); //route to get song by id from the playlist
router.get('/:id/songs/name/:songName',protect,getSongsByNameInPlaylist);//route to get songs by name in playlist 


module.exports=router;