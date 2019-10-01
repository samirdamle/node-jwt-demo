require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())

const posts = [
    {
        title: 'John\'s post',
        username: 'john',
    },
    {
        title: 'Mary\'s post',
        username: 'mary',
    },
    {
        title: 'Henry\'s post',
        username: 'henry',
    },
]
const jwt = require('jsonwebtoken')


app.get('/', (req, res) => {
    res.json(posts)
})

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter((post) => (post.username === req.user.name)))
})

app.post('/sign-in', (req, res) => {
    // Authenticate User
    const username = req.body.username
    const user = {name: username}

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken: accessToken})
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token === null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.listen(3000)