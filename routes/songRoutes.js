const express= require('express');
const router=express.Router();

const {getSongs,getSongById,getSongByName,getSongByAlbum,getSongByArtist,
    getSongByMusicDirector, createSong,updateSong,deleteSong,
    makeSongVisible, makeSongInVisible,
    getAllVisibleSongs
}= require('../controllers/songController.js');

const{protect,admin}=require('../middleware/authMiddleware.js');

router.get('/visiblesongs',protect,getAllVisibleSongs);
router.get('/id/:id',protect,getSongById);
router.get('/name/:songName',protect,getSongByName);
router.get('/album/:album',protect,getSongByAlbum);
router.get('/artist/:artist',protect,getSongByArtist);
router.get('/musicdirector/:musicDirector',protect,getSongByMusicDirector);
router.get('/',protect,admin,getSongs);
router.post('/song',protect,admin,createSong);
router.put('/song/:id',protect,admin,updateSong);
router.delete('/song/:id',protect,admin,deleteSong);
router.put('/song/makevisible/:id',protect,admin,makeSongVisible);
router.put('/song/makeinvisible/:id',protect,admin,makeSongInVisible);
module.exports=router;