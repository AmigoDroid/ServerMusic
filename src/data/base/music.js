import sequelize from "sequelize"
import db from '../sequelize.js';

const music = db.define("music",
    {
        id:
            {
                primaryKey:true,
                autoIncrement:true,
                allowNull:false,
                type:sequelize.INTEGER
            },
        title:
            {
                allowNull:false,
                type:sequelize.STRING
            },
        tokenName:
            {
                allowNull:false,
                type:sequelize.STRING
            },
        src:
            {
                allowNull:false,
                type:sequelize.STRING
            },
        thumbnail:
            {
                allowNull:true,
                type:sequelize.STRING
            }
    }
);
export {music}