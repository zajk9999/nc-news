const express = require("express")
const { getTopics } = require("./controllers/nc-news-controllers")
const app = express()

app.get("/api/topics", getTopics)


// error handling

app.use((err, request, response, next) => {
   
   {
    response.status(500).send({msg: "Imternal Server Error"})
  }
  next(err)
})



module.exports = app