const express = require("express");
const { getTopics, getArticleById, sendEndpoints, getArticles, getCommentsByArticleId, postCommentByArticleId, updateVotes, removeCommentById, getUsers } = require("./controllers/nc-news-controllers");
const { psqlErrorHandler, customErrorHandler, serverErrorHandler } = require("./errorhandlers");
const app = express();

app.use(express.json());

app.get("/api", sendEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", updateVotes )

app.delete("/api/comments/:comment_id", removeCommentById)

app.all("*", (request, response, next) => {
    response.status(404).send({msg: "Path Not Found"})
})



app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);


module.exports = app