'use strict';
/**
 * Created by Nir Mekin on 5/10/2017.
 */
const   express     = require('express'),
        bodyParser  = require('body-parser'),
        app         = express(),
        musicPlayer = require('./app/index'),
        port        = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//get instance of class musicPlayer
var mPlayer = musicPlayer();

//Abstract Function for relevant method matching the rout
function abstractFunction(res,fun,param1,param2){
    try{
       fun(param1,param2).then((result) => {
            res.status(200).json(result);
            console.log(`==========\n${result}\n Received successfully from the database!\n==========`);
        })
    }catch(err) {
        console.log(`==========\nFailed to retrieve data: ${err}\n==========`);
        res.status(200).json({"Error":"DB issue"});
    }
}

app.all('*', (req, res, next) => {
    console.log('==== Request received ====');
    req.next();
});

// SONGS Routes
app.get('/getAllSongs', (req, res) => {
    abstractFunction(res,mPlayer.getAllSongs);
});

app.get('/getSongsByTitle/:title', (req, res) => {
    abstractFunction(res,mPlayer.getSongsByTitle,req.params.title);
});

app.post('/getSongsByGenre/',(req,res)=> {
    abstractFunction(res,mPlayer.getSongsByGenre,req.body.genre);
});

app.get(`/getSongsByArtist/:artist`,(req,res)=>{
    abstractFunction(res,mPlayer.getSongsByArtist,req.params.artist);
})

// USERS Routes
app.get(`/getAllUsers`,(req,res)=>{
    abstractFunction(res,mPlayer.getAllUsers);
})

app.get(`/getUserByID/:id`,(req,res)=>{
    abstractFunction(res,mPlayer.getUserByID,req.params.id);
})

// MIXES Routes
app.get(`/getAllMixes`,(req,res)=>{
    abstractFunction(res,mPlayer.getAllMixes);
})

app.get(`/getMixesByUserID/:id`,(req,res)=>{
    abstractFunction(res,mPlayer.getMixesByUserID,req.params.id);
})

app.post('/getMixesByHashtags',(req,res)=>{
    abstractFunction(res,mPlayer.getMixesByHashtags,req.body.hashtag);
})

app.listen(port);
console.log(`listening on port ${port}`);


