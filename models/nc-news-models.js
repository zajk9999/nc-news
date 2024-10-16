const db = require("../db/connection")

exports.fetchTopics = () => {
    return db
    .query("SELECT * FROM topics;")
    .then(({rows}) => {
        return rows
    })
}

exports.fetchArticleById = (article_id) => {
    return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id]).then(({rows}) => {
        if(!rows.length) {
            return Promise.reject({status: 404, msg: 'Article does not exist'})
          }
        return rows[0]
    })
}


exports.fetchArticles = () => {
    return db
    .query("SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT (comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;")
    .then(({rows}) => {
        return rows
    })
}

exports.fetchCommentsByArticleId = (article_id) => {
    return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id]).then(({rows}) => {
        if(!rows.length) {
            return Promise.reject({status: 404, msg: 'Article does not exist'})
          } 
        return db.query("SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC", [article_id]).then(({rows}) => {
             return rows
        })
    })
}

exports.insertComment = ({username, body}, article_id) => {
    return db
    .query(`INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *; `, [username, body, article_id])
    .then((result) => {
        return result.rows[0]
        })
}