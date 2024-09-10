const express= require('express');
const router=express.Router();

const {getSongs,getSongById,getSongByName,getSongByAlbum,getSongByArtist,
    getSongByMusicDirector, createSong,updateSong,deleteSong,
    makeSongVisible, makeSongInVisible,
    getAllVisibleSongs
}= require('../controllers/songController.js');

const{protect,admin}=require('../middleware/authMiddleware.js');

router.get('/',protect,admin,getSongs); //route to fetch all songs by the admin
router.get('/visiblesongs',protect,getAllVisibleSongs); //route to fetch all visible songs by the user
router.get('/id/:id',protect,getSongById); //route to fetch song by id
router.get('/name/:songName',protect,getSongByName); //route to fetch songs by name
router.get('/album/:album',protect,getSongByAlbum); //route to fetch songs by album name
router.get('/artist/:artist',protect,getSongByArtist); //route to fetch songs by artist name
router.get('/musicdirector/:musicDirector',protect,getSongByMusicDirector); //route to fetch songs by music director
router.post('/song',protect,admin,createSong); //route to create song by the admin
router.put('/song/:id',protect,admin,updateSong); //route to update song by the admin
router.delete('/song/:id',protect,admin,deleteSong); //route to delete song by the admin
router.put('/song/makevisible/:id',protect,admin,makeSongVisible); //route to make song visible to the user
router.put('/song/makeinvisible/:id',protect,admin,makeSongInVisible); //route to make song invisible to the user
module.exports=router;