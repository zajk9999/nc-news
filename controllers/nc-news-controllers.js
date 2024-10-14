const { fetchTopics } = require("../models/nc-news-models")


exports.getTopics = ((request, response, next) => {
    fetchTopics().then((topics) => {
        response.status(200).send({topics})
    })
})

