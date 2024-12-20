const request = require("supertest")
const app = require("../app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const endpoints = require("../endpoints.json")

beforeEach(() => {
	return seed(data);
});

afterAll(() => {
	db.end();
});

describe("/api/topics", () => {
	it("GET: 200 - responds with array of topic objects", () => {
		return request(app)
			.get("/api/topics")
			.expect(200)
			.then(({ body }) => {
				expect(body.topics.length).toBe(3);
				body.topics.forEach((topic) => {
					expect(typeof topic.slug).toBe("string");
					expect(typeof topic.description).toBe("string");
				});
			});
	});
});

describe("/api", () => {
	it("GET: 200 - responds with an object with all available endpoints", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then(({ body }) => {
				expect(body.endpoints).toEqual(endpoints);
			});
	});

});

describe("/api/articles/:article_id", () => {
	it("GET: 200 - responds with a correct article object", () => {
		return request(app)
			.get("/api/articles/3")
			.expect(200)
			.then(({ body }) => {
				expect(body.article.article_id).toBe(3);
				expect(body.article.author).toBe("icellusedkars");
				expect(body.article.title).toBe("Eight pug gifs that remind me of mitch");
				expect(body.article.body).toBe("some gifs");
				expect(body.article.topic).toBe("mitch");
				expect(body.article.created_at).toBe("2020-11-03T09:12:00.000Z");
				expect(body.article.votes).toBe(0);
				expect(body.article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
			});
	});
	it("GET: 200 - responds with a correct article object", () => {
		return request(app)
			.get("/api/articles/3")
			.expect(200)
			.then(({ body }) => {
				expect(body.article.comment_count).toBe("2")
			});
	});
	it("GET: 400 - responds with 'Bad Request' when given invalid ID as a parameter", () => {
		return request (app)
			.get("/api/articles/not-a-valid-id")
			.expect(400)
			.then(({body})=> {
				expect(body.msg).toBe("Bad Request")
			}) 
	})
	it("GET: 404 - responds with 'Article does not exist' when given a valid but non-existent id", () => {
		return request(app)
		  .get("/api/articles/999")
		  .expect(404)
		  .then(({body}) => {
			expect(body.msg).toBe('Article does not exist');
		  });
	  });
	it('PATCH: 200 - updating the votes for the specific article and sends updated article object as a response', () => {
		const votesToUpdate = {
		  newVote: '2',		  
		};
		return request(app)
		  .patch("/api/articles/1")
		  .send(votesToUpdate)
		  .expect(200)
		  .then(({body}) => {
			expect(body.article.votes).toBe(102);
		  });
		})
	it('PATCH: 200 - ignoring extra keys in the objects and updates the article as long as the correct key is included', () => {
		const votesToUpdate = {
		 newVote: '-200',	
		 oldVote: '7'	  
		};
		return request(app)
		  .patch("/api/articles/1")
		  .send(votesToUpdate)
		  .expect(200)
		  .then(({body}) => {
			expect(body.article.votes).toBe(-100);
			  });
			})
	it("PATCH: 400 - responds with an appropriate status and error message when provided with the object without correct key", () => {
		const votesToUpdate = {
			oldVote: '7'	  
		   };
		   return request(app)
			 .patch("/api/articles/1")
			 .send(votesToUpdate)
			 .expect(400)
			 .then(({body}) => {
			   expect(body.msg).toBe("Bad Request");
				});
			})
	it("PATCH: 400 - responds with an appropriate status and error message when not provided with the object", () => {
		return request(app)
			 .patch("/api/articles/1")
			 .send()
			 .expect(400)
			 .then(({body}) => {
			  expect(body.msg).toBe("Bad Request");
			});
		})
	it('PATCH: 404 - responds with "Article does not exist" message when given the given article id whoch does not exist', () => {
		const votesToUpdate = {
		 newVote: '-2',	
			};
			return request(app)
			  .patch("/api/articles/99")
			  .send(votesToUpdate)
			  .expect(404)
			  .then(({body}) => {
				expect(body.msg).toBe("Article does not exist");
				  });
			})
});

describe("/api/articles", () => {
	it("GET: 200 - responds with an array of articles", () => {
		return request(app)
		.get("/api/articles")
		.expect(200)
		.then(({ body }) => {
			expect(body.articles.length).toBe(13);
			body.articles.forEach((article) => {
				expect(typeof article.article_id).toBe("number");
				expect(typeof article.author).toBe("string");
				expect(typeof article.title).toBe("string");
				expect(typeof article.body).toBe("undefined");
				expect(typeof article.topic).toBe("string");
				expect(typeof article.created_at).toBe("string");
				expect(typeof article.votes).toBe("number");
				expect(typeof article.article_img_url).toBe("string");
				expect(typeof article.comment_count).toBe("string")
			});
		});
	});
	it("GET: 200 - responds with an array of articles in the descending order", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy("created_at", {descending: true});
			});
	});
	it("GET: 200 - responds with an array of articles in the descending order", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy("created_at", {descending: true});
			});
	});
	it("GET: 200 - takes sort_by query parameter and responds with an array of articles sorted by the given column in the descending order", () => {
		return request(app)
			.get("/api/articles?sort_by=article_id")
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy("article_id", {descending: true});
			});
	});
	it("GET: 200 - takes order query parameter and responds with an array sorted by created_at in the given order", () => {
		return request(app)
			.get("/api/articles?order=asc")
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy("created_at");
			});
	});
	it("GET: 200 - takes sort_by and order query parameters and responds with an array of articles sorted by the given column in the given order", () => {
		return request(app)
			.get("/api/articles?order=asc&sort_by=article_id")
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy("article_id");
			});
	});
	it("GET: 200 - ignores any additional quey parameters as long as there is at least 1 valid one", () => {
		return request(app)
			.get("/api/articles?order=asc&sort_by=article_id&something")
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy("article_id");
			});
	});
	it("GET: 200 - ignores query parameters which does not exist and responds with the defaulted array", () => {
		return request(app)
			.get("/api/articles?author=john")
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy("created_at", {descending: true});
			});
	});
	it("GET: 400 - when provided with the valid parameter which is not greenlisted", () => {
		return request(app)
			.get("/api/articles?sort_by=article_name")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Query not valid");
			});
	});
	it("GET: 400 - when provided with the valid parameter which is greenlisted, but for the different query parameter", () => {
		return request(app)
			.get("/api/articles?order=article_id")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Query not valid");
			});
	});
	it("GET: 200 - responds with an array of articles about a queried topic if topic is provided as a query parameter", () => {
		return request(app)
		.get("/api/articles?topic=mitch")
		.expect(200)
		.then(({ body }) => {
			expect(body.articles.length).toBe(12);
			body.articles.forEach((article) => {
				expect(article.topic).toBe("mitch");
			});
		});
	});
	it("GET: 200 - responds with an array of articles about a queried topic if topic if all parameters are provided", () => {
		return request(app)
		.get("/api/articles?topic=mitch&order=asc&sort_by=article_id")
		.expect(200)
		.then(({ body }) => {
			expect(body.articles.length).toBe(12);
			expect(body.articles).toBeSortedBy("article_id");
			body.articles.forEach((article) => {
				expect(article.topic).toBe("mitch");
			});
		});
	})
	it("GET: 404 - responds with appropriate message when there is no articles for given topic", () => {
		return request(app)
		.get("/api/articles?topic=kev")
		.expect(404)
		.then(({ body }) => {
			expect(body.msg).toBe("Topic Not Found")
		});
	});
})

describe("/api/articles/:article_id/comments", () => {
	it("GET: 200 - responds with a correct comments array", () => {
		return request(app)
			.get("/api/articles/3/comments")
			.expect(200)
			.then(({ body }) => {
				expect(body.comments.length).toBe(2);
				body.comments.forEach((comment) => {
					expect(typeof comment.comment_id).toBe("number");
					expect(typeof comment.author).toBe("string");
					expect(typeof comment.article_id).toBe("number");
					expect(typeof comment.body).toBe("string");
					expect(typeof comment.created_at).toBe("string");
					expect(typeof comment.votes).toBe("number");
					
				});
		});
	})
	it("GET: 200 - responds with an array of comments in the descending order", () => {
		return request(app)
			.get("/api/articles/3/comments")
			.expect(200)
			.then(({ body }) => {
				expect(body.comments).toBeSortedBy("created_at", {descending: true});
			});
	});
	it("GET: 200 - responds with an empty array when given an id for the existing article, but there is no comments", () => {
		return request(app)
		  .get("/api/articles/10/comments")
		  .expect(200)
		  .then(({body}) => {
			expect(body.comments).toEqual([]);
		  });
	  });
	it("GET: 400 - responds with 'Bad Request' when given invalid article ID as a parameter", () => {
		return request (app)
			.get("/api/articles/not-a-valid-id/comments")
			.expect(400)
			.then(({body})=> {
				expect(body.msg).toBe("Bad Request")
			}) 
	})
	it("GET: 404 - responds with 'Article does not exist' when given a valid but non-existent article id", () => {
		return request(app)
		  .get("/api/articles/999/comments")
		  .expect(404)
		  .then(({body}) => {
			expect(body.msg).toBe('Article does not exist');
		  });
	  });
	it('POST: 201 - adds a new comment for the specific article and sends the new comment back as a response', () => {
		const newComment = {
		  username: 'rogersop',
		  body: "It's amazing"
		};
		return request(app)
		  .post("/api/articles/3/comments")
		  .send(newComment)
		  .expect(201)
		  .then(({body}) => {
			expect(typeof body.comment.comment_id).toBe("number");
			expect(body.comment.article_id).toBe(3);
			expect(body.comment.author).toBe('rogersop');
			expect(body.comment.body).toBe("It's amazing");
		  });
	  });
	  it('POST: 201 - ignores additional keys in the given object and creates the comment as long as the necessary keys are included', () => {
		const newComment = {
		  username: 'rogersop',
		  body: "It's amazing",
		  author: "Pikachu"
		};
		return request(app)
		  .post("/api/articles/3/comments")
		  .send(newComment)
		  .expect(201)
		  .then(({body}) => {
			expect(typeof body.comment.comment_id).toBe("number");
			expect(body.comment.article_id).toBe(3);
			expect(body.comment.author).toBe('rogersop');
			expect(body.comment.body).toBe("It's amazing");
		  });
	  });
	  it("POST: 404 - responds with an appropriate status and error message when provided with the article id that doesn't exist", () => {
		const newComment = {
			username: 'rogersop',
			body: "It's amazing"
		  };
		return request(app)
		  .post('/api/articles/99/comments')
		  .send(newComment)
		  .expect(404)
		  .then(({body}) => {
			expect(body.msg).toBe('Article does not exist');
		  });
	  });
	  it("POST: 406 - responds with an appropriate status and error message when provided with the username that doesn't exist", () => {
		const newComment = {
			username: 'pikachu',
			body: "It's amazing"
		  };
		return request(app)
		  .post('/api/articles/9/comments')
		  .send(newComment)
		  .expect(406)
		  .then(({body}) => {
			expect(body.msg).toBe('Username does not exist');
		  });
	  });
	  it("POST: 400 - responds with an appropriate status and error message when not provided with the object", () => {
		const newComment = {
			user: 'rogersop',
			body: "It's amazing"
		  };
		return request(app)
		  .post('/api/articles/9/comments')
		  .send()
		  .expect(400)
		  .then(({body}) => {
			expect(body.msg).toBe('Bad Request');
		  });
	  });
	  it("POST: 400 - responds with an appropriate status and error message when provided with the object without correct keys", () => {
		const newComment = {
			user: 'rogersop',
			body: "It's amazing"
		};
		return request(app)
		  .post('/api/articles/9/comments')
		  .send(newComment)
		  .expect(400)
		  .then(({body}) => {
			expect(body.msg).toBe('Bad Request');
		  });
	  });

})
	
describe("/api/comments/:comment_id", () => {
	it("DELETE: 204 - deletes the comment by it's id and sends no body back", () => {
		return request(app)
			.delete("/api/comments/5")
			.expect(204)
	})
	it("DELETE: 400 - responds with the 'Bad Request' when provided with the invalid comment id", () => {
		return request(app)
			.delete("/api/comments/not-a-number")
			.expect(400)
			.then(({body}) => {
				expect(body.msg).toBe("Bad Request")
			})
	})	
	it("DELETE: 404 - responds with the 'Comment does not exist' when provided with the comment id in the valid format, but which does not exist", () => {
		return request(app)
			.delete("/api/comments/999")
			.expect(404)
			.then(({body}) => {
				expect(body.msg).toBe("Comment does not exist")
			})
	})	
})

describe("/api/users", () => {
	it("GET: 200 - responds with array of users objects", () => {
		return request(app)
			.get("/api/users")
			.expect(200)
			.then(({ body }) => {
				expect(body.users.length).toBe(4);
				body.users.forEach((user) => {
					expect(typeof user.username).toBe("string");
					expect(typeof user.name).toBe("string");
					expect(typeof user.name).toBe("string");
					});
			});
	});
});

describe("/*", () => {
	it("ALL: 404 - responds with 'Path Not Found' message when provided with the wrong path", () => {
		return request(app)
			.get("/api/wrong-path")
			.expect(404)
			.then(({body}) => {
				expect(body.msg).toBe("Path Not Found")
			})
	})
})