'use strict';
/**
 * Created by Nir Mekin on 5/10/2017.
 */
const   express     = require('express'),
        bodyParser  = require('body-parser'),
        app         = express(),
        musicPlayer = require('./NewNervesMdl/index'),
        port        = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use( (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    //res.set('Content-Type', 'application/json');  //Dont need it, cause API contained in this WS
    next();
});

//get instance of class musicPlayer
var mPlayer = musicPlayer();

//Abstract Function for relevant method matchcleaing the rout
function abstractFunction(res,fun,param1,param2){

       fun(param1,param2).then((result) => {
            res.status(200).json(result);
            console.log(`==========\n${result}\n Received successfully from the database!\n==========`);
        }).catch((err)=> {
        console.log(`==========\nFailed to retrieve data: ${err}\n==========`);
        // res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({"Error":"DB issue"});
    });
}

app.all('*', (req, res, next) => {
    console.log('==== Request received ====');
    req.next();
});

//Get API
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/API/`);
});
//Get css File for API
app.get('/includes/style.css',(req,res)=>{
    res.sendFile(`${__dirname}/API/includes/style.css`);
});

app.get('/images/NNLogo.jpg',(req,res)=>{
    res.sendFile(`${__dirname}/API/images/NNLogo.jpg`);
});


// SONGS Routes
app.get('/getAllSongs', (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    abstractFunction(res,mPlayer.getAllSongs);
});

app.get('/getSongByID/:id', (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    abstractFunction(res,mPlayer.getSongByID, req.params.id);
});

app.get('/getSongsByTitle/:title', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    abstractFunction(res,mPlayer.getSongsByTitle,req.params.title);
});

app.use('/getSongsByGenre/',(req,res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    abstractFunction(res,mPlayer.getSongsByGenre,req.body.genre);
});

app.get(`/getSongsByArtist/:artist`,(req,res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    abstractFunction(res,mPlayer.getSongsByArtist,req.params.artist);
});

// USERS Routes
app.get(`/getAllUsers`,(req,res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    abstractFunction(res,mPlayer.getAllUsers);
});

app.get(`/getUserByIDAndPass/:username/:userpassword`,(req,res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    abstractFunction(res,mPlayer.getUserByIDAndPass,req.params.username,req.params.userpassword);
});

app.use(`/addNewUser`, (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
        mPlayer.addNewUser(req.body.username, req.body.name, req.body.profilepic, req.body.address, req.body.about, req.body.userpassword).then((result) => {
            console.log(result);
            res.status(200).json(result);
        }).catch ((err)=> {
            console.log(err.message);
            res.status(200).json({"Error" : "Problem with data input"});
    });
});

app.use(`/updateUserName`, (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    mPlayer.updateUserName(req.body.id, req.body.name).then((result) => {
        console.log(result);
        res.status(200).json(result);
    });
});

app.use(`/updateUserProfilePic`, (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    mPlayer.updateUserProfilePic(req.body.id, req.body.profilepic);
});

// MIXES Routes
app.get(`/getAllMixes`,(req,res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    abstractFunction(res,mPlayer.getAllMixes);
});

app.get(`/getMixesByUserID/:id`,(req,res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    abstractFunction(res,mPlayer.getMixesByUserID,req.params.username);
});

app.use('/getMixesByHashtags',(req,res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    abstractFunction(res,mPlayer.getMixesByHashtags,req.body.hashtag);
});

app.use(`/addNewMix`, (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    mPlayer.addNewMix(req.body.username, req.body.mixname).then((result) => {
        console.log(result);
        res.status(200).json(result);
    });
});

app.use(`/addHashTagToMix`, (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    mPlayer.addHashTagToMix(req.body.username, req.body.mixid, req.body.hashtag).then((result) => {
        console.log(result);
        res.status(200).json(result);
    });
});

app.use(`/addCommentToMix`, (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    mPlayer.addCommentToMix(req.body.userid, req.body.mixid, req.body.comment).then((result) => {
        console.log(result);
        res.status(200).json(result);
    });
});

app.use(`/addSongToMix`, (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    mPlayer.addSongToMix(req.body.userid, req.body.mixid, req.body.songid).then((result) => {
        console.log(result);
        res.status(200).json(result);
    });
});

app.listen(port);
console.log(`listening on port ${port}`);


