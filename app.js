const express = require("express")
const { getTopics, getArticleById, sendEndpoints, getArticles } = require("./controllers/nc-news-controllers")
const { psqlErrorHandler, customErrorHandler, serverErrorHandler } = require("./errorhandlers")
const app = express()

app.get("/api", sendEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.use(psqlErrorHandler)

app.use(customErrorHandler)

app.use(serverErrorHandler)


module.exports = app