import { Sequelize } from "sequelize";
import { configDB } from "./config/config.js";
const {database,user,pass,host} = configDB;
const sequelize = new Sequelize(database,user,pass,{host:host,dialect:"postgres"});
function start(){
    sequelize.authenticate()
    .then(obj => console.log("conectado"))
    .catch(error => {
        console.log("erro ao se conectar \n\n conectando novamente em 5 seg");
        setTimeout(()=>{start()},5000)
    });
}
start();
export default sequelize;