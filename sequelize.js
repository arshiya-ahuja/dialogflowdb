const Sequelize = require('sequelize')
const UserModel = require('./models/user')
const IntentModel = require('./models/intents')
const SessionModel = require('./models/sessions')


const sequelize = new Sequelize('dialogflow','root','Arshiya2004',{
    host:'localhost',
    dialect: 'mysql',
    pool:{
        max:10,
        min:0,
        acquire: 3000,
        idle: 10000
    }
})

sequelize.databaseVersion().then((databaseVersion) => {
    console.log(databaseVersion);
} );



const User = UserModel(sequelize, Sequelize)
const SessionIntents = sequelize.define('Session_Intent',{})
const sessions = SessionModel(sequelize, Sequelize)
const intents = IntentModel(sequelize,Sequelize)

sessions.belongsToMany(intents, {through: SessionIntents, unique: false})
intents.belongsToMany(sessions,{through: SessionIntents, unique:false})
sessions.belongsTo(User);

sequelize.sync({force: true})//force:true creates a new database at every startup node
    .then(() => {
        console.log('Database & tables created')
    })

    module.exports ={
        User,
        sessions,
        intents
    }

