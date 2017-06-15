/**
 * Created by Nir Mekin on 5/10/2017.
 */
const   express     = require('express'),
        bodyParser  = require('body-parser'),
        app         = express(),
        songs       = require('./songs_mdl'),
        users       = require('./users_mdl'),
        mixes       = require('./mixes_mdl'),
        port        = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



/*
* //songs

 getSongsByTitle(title: string);
 getSongsByArtist(genre: string);
 */

// getAllSongs();
app.get('/getAllSongs',(req,res)=> {
    "use strict";
    try {
        songs.getAllSongs().then((result) => {
            res.json(result);
        });
    }
    catch (errResult){
        console.log(errResult);
        res.json({"error":"songs not found"});
    }
})

// getSongsByGenre(genre: string);  // BY POST
// app.post('/getSongsByGenre/',(req,res)=>{
//     "use strict";
//     try{
//         songs.getSongsByGenre(bodyParser.params.genres).then((result)=>{
//             res.json(result);
//         })
//     }catch (errResult){
//         console.log(errResult);
//         res.json({"error":"Genre not fount"});
//     }
// })




//friendly Page not fount ( 404 )
app.all('*',(req,res)=>{
    "use strict";
    res.status(404).json({"Error":"404 - Page not found"});
})

app.listen(port,
    ()=>{
        console.log(`listening on port ${port}`);
    });
