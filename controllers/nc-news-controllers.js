const { request } = require("../app")
const { fetchTopics, fetchArticleById } = require("../models/nc-news-models")

exports.sendEndpoints = (() => {
    require("../endpoints.json").then((endpoints)=> {
        console.log(endpoints)
        response.status(200).send({endpoints})
    })
})

exports.getTopics = ((request, response, next) => {
    fetchTopics().then((topics) => {
        response.status(200).send({topics})
    })
})

exports.getArticleById = ((request, response, next) => {
    const {article_id} = request.params
    fetchArticleById(article_id).then((row) => {
        response.status(200).send({article: row})
    }).catch((err) => {
         next(err)
    })
})


