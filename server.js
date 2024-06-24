import express from 'express'
import {loggerService} from './services/logger.service'
import cookieParser from 'cookie-parser'

const app = express()
app.use(cookieParser())

app.use(express.static('public'))
app.use(cookieParser())

const port = 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))//loggerService.info


app.get('/', function (req, res) {
    res.send('Hello World')
  })