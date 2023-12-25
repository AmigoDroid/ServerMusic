import express from 'express';
import fs from "fs";
import util from 'util';
import multer, { memoryStorage } from 'multer';
import path from 'path';
import cors from 'cors'
import {initializeApp} from "firebase/app";
import {getStorage,ref,getDownloadURL, uploadBytes} from 'firebase/storage'
import { MusicManager } from '../data/manager/manegerMusica.js';
const app = express();



app.use(cors({origin:"*"}))
app.set("view engine","ejs")
app.use(express.static("music"));





const music = new MusicManager();
const porta = process.env.PORT || 8080;
const getStat = util.promisify(fs.stat);
const gerarHash = ()=> Math.random().toString(16).substr(2);
const uploadFile = multer({storage:memoryStorage()})
const firebaseConfig = {
    apiKey: "AIzaSyBkqIw9woY1xwC0OSxL99QpRGzFmJAwRUI",
    authDomain: "uploadfilesteste.firebaseapp.com",
    projectId: "uploadfilesteste",
    storageBucket: "uploadfilesteste.appspot.com",
    messagingSenderId: "412149640101",
    appId: "1:412149640101:web:d6e4e472faa0fe980b564c"
  };
const fireApp = initializeApp(firebaseConfig);
const fireStorage = getStorage(fireApp);







app.get("/api/upload",(request,response)=>{
    response.render("index")
})
app.get("/",async(request,response)=>{
    response.json(await music.musicList())
})


app.post("/upload/music",uploadFile.single("musicFile"),async(request,response)=>{
  try {
    const file = request.file;
    const title = file.originalname
    const tokenName = gerarHash()
   
    const thumbnailURL = "";
    if(!file.originalname) throw new Error("erro file undefined")
    const storageRef = ref(fireStorage,`music/${tokenName}${path.extname(title)}`);
     await uploadBytes(storageRef,file.buffer,{contentType:file.mimetype})
     const srcURL = await getDownloadURL(storageRef);
   
    await music.uploadMusic(title,tokenName,srcURL,thumbnailURL)?
    response.status(200).json(
    {
        title:title,
        src:srcURL
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
