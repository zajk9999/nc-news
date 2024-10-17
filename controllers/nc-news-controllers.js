const { request } = require("../app")
const { fetchTopics, fetchArticleById, fetchArticles, fetchCommentsByArticleId, insertComment, patchVotes, deleteCommentById, fetchUsers } = require("../models/nc-news-models")
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
    const {sort_by, order} = request.query
    fetchArticles(sort_by, order).then((articles) => {
         response.status(200).send({articles})
    }).catch((err) => {
        next(err)
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

exports.postCommentByArticleId = (request,response, next) => {
    const {article_id} = request.params
    const newComment = request.body
    insertComment(newComment, article_id).then((comment) => {
        response.status(201).send({ comment });
      }).catch((err)=>{
           next(err)
      });
}

exports.updateVotes = (request,response, next) => {
    const {article_id} = request.params
    const votesToUpdate = request.body
    patchVotes(votesToUpdate, article_id).then((article) => {
            response.status(200).send({ article });
      }).catch((err)=>{
           next(err)
      });
}

exports.removeCommentById = (request, response, next) => {
    const {comment_id} = request.params
    deleteCommentById(comment_id).then(() => {
        response.status(204).send()
    }).catch((err)=>{
        next(err)
   });
}

exports.getUsers = ((request, response, next) => {
    fetchUsers().then((users) => {
        response.status(200).send({users})
    })
})
