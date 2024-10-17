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

exports.fetchArticles = (sort_by = "created_at", order = "desc") => {

    const allowedQueriesSortBy = ["author", "title", "article_id", "topic", "created_at", "votes", "article_img_url", "comment_count"]

    const allowedQueriesOrder = ["asc", "desc"]
 
    let queryStr = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT (comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id`

    if(!allowedQueriesSortBy.includes(sort_by) || !allowedQueriesOrder.includes(order)) {
        return Promise.reject({ status: 400, msg: "Query not valid" });
    }

    queryStr += ` ORDER BY ${sort_by} ${order}`
    return db
    .query(queryStr)
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
    .then(({rows}) => {
        return rows[0]
        })
}

exports.patchVotes = ({newVote}, article_id) => {
    return db
    .query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [newVote, article_id])
    .then(({rows}) => {
        if(!rows.length) {
            return Promise.reject({status: 404, msg: 'Article does not exist'})
          } 
        return rows[0]
        })
}

exports.deleteCommentById = (comment_id) => {
    return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({rows}) => {
        if(!rows.length) {
            return Promise.reject({status: 404, msg: "Comment does not exist"})
        }
    return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
    })
}

exports.fetchUsers = () => {
    return db
    .query("SELECT * FROM users;")
    .then(({rows}) => {
        return rows
    })
}

