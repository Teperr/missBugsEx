import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'


import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js'


const app = express()


app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())



//Bugs List
app.get('/api/bug', (req, res) => {
    const filterBy = {
        title: req.query.title || '',
        minSeverity: +req.query.minSeverity || 0,
        pageIdx: +req.query.pageIdx || 0,
        sortBy: req.query.sortBy || '',
        sortDir: +req.query.sortDir || 1,
        labels: req.query.labels || []

    }

    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error(`Couldn't get bugs...`)
            res.status(500).send(`Couldn't get bugs...`)
        })

})

//Bug by ID
var visitedBugs = []
app.get('/api/bug/:id', (req, res) => {
    const { id } = req.params

    bugService.getById(id)
        .then(bug => {
            var bugIdReq = req.cookies.visitedBugs

            res.cookie('visitedBugs', bug._id)
            visitedBugs.push(bugIdReq)
            console.log('visitedBugs:', visitedBugs)
            res.send(bug)
        })
})


//Remove Bug
app.delete('/api/bug/:id', (req, res) => {
    const { id } = req.params

    bugService.remove(id)
        .then(() => res.send(`Bug ${id} deleted...`))
})

//Save Bug (2 function)
//New Bug
app.post('/api/bug', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    console.log('loggedinUser post:', loggedinUser)
    if (!loggedinUser) return res.status(401).send('Cannot update car')

    const { _id, title, severity, description } = req.body
    const bugToSave = { _id, title, severity: +severity, description, 'creator': loggedinUser }
    console.log('bugToSave:', bugToSave)
    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
})


//Update Bug
app.put('/api/bug/:id', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    console.log('loggedinUser put:', loggedinUser)
    if (!loggedinUser) return res.status(401).send('Cannot update car')

    const { _id, title, severity, description } = req.body
    const bugToSave = { _id, title, severity: +severity, description }

    console.log('bugToSave put:', bugToSave)

    bugService.save(bugToSave, loggedinUser)
        .then(savedBug => res.send(savedBug))
        .catch((err) => {
            loggerService.error('Cannot save car', err)
            res.status(400).send('Cannot save car')
        })
})


// AUTH API
app.get('/api/user', (req, res) => {
    userService.query()
        .then((users) => {
            res.send(users)
        })
        .catch((err) => {
            console.log('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.getById(userId)
        .then((user) => {
            res.send(user)
        })
        .catch((err) => {
            console.log('Cannot load user', err)
            res.status(400).send('Cannot load user')
        })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot signup')
            }
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})


app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const PORT = process.env.PORT || 3030
app.listen(PORT, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`))

