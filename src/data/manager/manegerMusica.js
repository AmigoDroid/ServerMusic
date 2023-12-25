import { music } from "../base/music.js";


class MusicManager{

   async uploadMusic(title,tokenName,src,thumbnail){
       return music.create({title:title,tokenName:tokenName,src:src,thumbnail:thumbnail})
       .then((e)=>{return true})
       .catch((erro)=>{ console.log(erro); return false;})
    }
    async musicList(){
        return await music.findAll();
    }
    async newTableMusic(){
        music.sync()
    }
}


export {MusicManager}