import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'


const app = express()


app.use(express.static('public/miss-bug-starter-react'))
app.use(cookieParser())
app.use(express.json())

const port = 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))//loggerService.info

//Bugs List
app.get('/api/bug', (req, res) => {
    const filterBy = {
        title: req.query.title,
        severity: +req.query.severity
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
    const { _id, title, severity, description } = req.body
    const bugToSave = { _id, title, severity: +severity, description }
    console.log('bugToSave:', bugToSave)
    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
})

//Update Bug
app.put('/api/bug/:id', (req, res) => {
    const { _id, title, severity, description } = req.body
    const bugToSave = { _id, title, severity: +severity, description }

    console.log('bugToSave:', bugToSave)

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
})