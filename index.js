const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

const port= 3000
app.listen(port,() => {
    console.log(`Running on http://localhost:${port}`)
})

const {User, Sessions, Intents} = require('./sequelize')

app.post('/api/users', (req,res) => {
    User.create(req.body)
        .then(user => res.json(user))
})

app.get('/api/users', (req,res) =>{
    User.findAll().then(users => res.json(users))
})
//Change to find or create using suitable parameters

app.post('/api/blogs', (req, res) => {
    const body = req.body

    const Intents= body.Intents.map(Intents => Intents.findOrCreate({ where: { name: Intents.name }, defaults: { name: Intents.name }})
    //change to findonly
                                         .spread((Intents, created) => Intents))
    User.findById(body.userId)
        .then(() => Sessions.create(body))
        .then(Sessions => Promise.all(Intents).then(storedIntents => Sessions.addIntents(storedIntents)).then(() => Sessions))
        .then(blog => Sessions.findOne({ where: {id: Sessions.id}, include: [User, Intents]}))
        .then(blogWithAssociations => res.json(blogWithAssociations))
        .catch(err => res.status(400).json({ err: `User with id = [${body.userId}] doesn't exist.`}))
})
//change entire logic for sessions and intents 


app.get('/api/sessions/:userId?', (req, res) => {
    let query;
    if(req.params.userId) {
        query = Blog.findAll({ include: [
            { model: User, where: { id: req.params.userId } },
            { model: Tag }
        ]})
    } else {
        query = Sessions.findAll({ include: [Intents, User]})
    }
    return query.then( Sessions => res.json(Sessions))
})

app.get('/api/sessions/:intents/intents', (req, res) => {
    Sessions.findAll({
        include: [
            { model: Intents, where: { name: req.params.Intents } }
        ]
    })
    .then(Sessions => res.json(Sessions))
})