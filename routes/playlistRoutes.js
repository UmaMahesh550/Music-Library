const express= require('express');
const router=express.Router();

const {getAllPlaylists, getAllPlaylistsOfUser, getPlaylistById, createPlaylist,
    updatePlaylist,deletePlaylist,getAllSongsInPlaylist,
    addSongsToPlaylist,removeSongFromPlaylist,getSongByIdFromPlaylist,
    getSongsByNameInPlaylist
}= require('../controllers/playlistController.js');

const{protect,admin}=require('../middleware/authMiddleware.js');

router.get('/',protect,admin,getAllPlaylists);
router.get('/user',protect,getAllPlaylistsOfUser);
router.get('/id/:id',protect,getPlaylistById);
router.post('/playlist',protect,createPlaylist);
router.put('/playlist/:id',protect,updatePlaylist);
router.delete('/playlist/:id',protect,deletePlaylist);

router.get('/playlist/songs/:id',protect,getAllSongsInPlaylist);
router.post('/:id/songs', protect, addSongsToPlaylist); 
router.delete('/:id/songs/:songId', protect, removeSongFromPlaylist); 
router.get('/:id/songs/:songId',protect, getSongByIdFromPlaylist);
router.get('/:id/songs/name/:songName',protect, getSongsByNameInPlaylist);


module.exports=router;