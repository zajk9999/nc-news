const express = require("express")
const { getTopics, getArticleById } = require("./controllers/nc-news-controllers")
const app = express()
const endpoints = require("./endpoints.json")

app.get("/api", (request, response) => {
  response.status(200).send({endpoints})
})

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)


app.use((err, request, response, next) => {
  if(err.code === '22P02') {
    response.status(400).send({msg: 'Bad Request'})
  }
  next(err)
})

app.use((err, request, response, next) => {
  if(err.status && err.msg) {
    response.status(err.status).send({msg: err.msg})
  }
  next(err)
})


app.use((err, request, response, next) => {
  response.status(500).send({msg: "Internal Server Error"})
})



module.exports = app