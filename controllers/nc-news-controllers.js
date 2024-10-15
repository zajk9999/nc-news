const { request } = require("../app")
const { fetchTopics, fetchArticleById, fetchArticles, fetchCommentsByArticleId } = require("../models/nc-news-models")
const endpoints = require("../endpoints.json")

exports.sendEndpoints = ((request, response, next) => {
    response.status(200).send({endpoints})
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

exports.getArticles = ((request, response, next) => {
    fetchArticles().then((articles) => {
        response.status(200).send({articles})
    })
})


exports.getCommentsByArticleId = ((request, response, next) => {
    const {article_id} = request.params
    fetchCommentsByArticleId(article_id).then((rows) => {
        response.status(200).send({comments: rows})
    }).catch((err) => {
         next(err)
    })
})
