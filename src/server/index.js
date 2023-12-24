import express from 'express';
import fs from "fs";
import util from 'util';
import multer from 'multer';
import path, { dirname } from 'path';
import cors from 'cors'
import { MusicManager } from '../data/manager/manegerMusica.js';
const app = express();
app.use(cors({origin:"*"}))
app.set("view engine","ejs")
app.use(express.static("music"));
const music = new MusicManager();
const porta = process.env.PORT || 8080;
const getStat = util.promisify(fs.stat);
const storage = multer.diskStorage({
    destination:function(req,file,callback){
        req.titleMusic = file.originalname;
        callback(null,"music/")
    },
    filename:function(req,file,callback){
        const newName = Math.random().toString(16).substr(2)+path.extname(file.originalname);
        req.tokenMusicName = newName;
        callback(null,newName.toLowerCase());
    }
});
const uploadFile = multer({storage})
app.get("/api/upload",(request,response)=>{
    response.render("index")
})
app.get("/music/list",async(request,response)=>{
    response.json(await music.musicList())
})
app.post("/upload/music",uploadFile.single("musicFile"),async(request,response)=>{
  try {
    const title = request.titleMusic;
    const tokenName = request.tokenMusicName;
    const urlSRC = "https://"+request.host+"/play/music/"+tokenName;
    const thumbnailURL = "";
    await music.uploadMusic(title,tokenName,urlSRC,thumbnailURL)?
    response.status(200).json(
    {
        title:title,
        src:urlSRC
    }):
    response.status(403).json({message:"erro ao fazer upload"})
  } catch (error) {
    response.status(403).json({message:"erro Desconhecido ao fazer upload"})
  }
})
app.get("/play/music/:token",async (request,response)=>{
try {
    const tokenMusic = request.params.token;
    const file = "./music/"+tokenMusic;
    const stat = await getStat(file);
    response.writeHead(200,{"Content-Type":"audio/mp3",'Content-Length':stat.size});
    const strem = fs.createReadStream(file);
    strem.pipe(response);
} catch (error) {
    console.log("error");
    response.send(error)
}
})

app.get("/new/table",(request,response)=>{
    music.newTableMusic();
    response.send("ok")
})
app.listen(porta,()=>{
    console.log("SERVER ON PORT 8080");
})
