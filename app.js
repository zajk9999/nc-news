const express = require("express")
const { getTopics } = require("./controllers/nc-news-controllers")
const app = express()
const endpoints = require("./endpoints.json")

app.get("/api", (request, response) => {
  response.status(200).send({endpoints})
})
app.get("/api/topics", getTopics)




app.use((err, request, response, next) => {
  response.status(500).send({msg: "Internal Server Error"})
})



module.exports = app