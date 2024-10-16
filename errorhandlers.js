exports.psqlErrorHandler = (err, request, response, next) => {
    if(err.code === '22P02') {
      response.status(400).send({msg: 'Bad Request'})
    }
    
    if(err.code === '23503' && err.detail.includes("article_id") ) {
      response.status(404).send({msg: 'Article does not exist'})
    }
    
    if(err.code === '23503' && err.detail.includes("author")) {
      response.status(406).send({msg: 'Username does not exist'})
    }
    if(err.code === '23502') {
      response.status(400).send({msg: 'Bad Request'})
    }
    next(err)
  }
  
exports.customErrorHandler = (err, request, response, next) => {
    if(err.status && err.msg) {
      response.status(err.status).send({msg: err.msg})
    }
    next(err)
  }
  
  
  exports.serverErrorHandler = (err, request, response, next) => {
    response.status(500).send({msg: "Internal Server Error"})
  }
  