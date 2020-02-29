const express = require("express")
const bodyParser = require("body-parser");
const app = express()
const jsonParser = bodyParser.json()
const port = 3000
const maxMessages = 5
let messageCounter = 0
app.use(jsonParser)


const messagesLimit = (req, res, next) => {
  messageCounter += 1
  if (messageCounter > maxMessages) {
    return res.status(429).end()
  }
  return next()
}

app.post('/messages', messagesLimit, (req, res) => {
  if (req.body.text && req.body.text !== "") {
    return res.json({ message: req.body.text })
  }
  return res.status(400).end()
})

app.listen(port, () => console.log("Listening on port :", port))