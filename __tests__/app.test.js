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
	test('POST: 201 - adds a new comment for the specific article and sends the new comment back as a response', () => {
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
	  test('POST: 201 - ignores additional keys in the given object and creates the comment as long as the necessary keys are included', () => {
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
	  test("POST: 404 - responds with an appropriate status and error message when provided with the article id that doesn't exist", () => {
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
	  test("POST: 406 - responds with an appropriate status and error message when provided with the username that doesn't exist", () => {
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
	  test("POST: 400 - responds with an appropriate status and error message when not provided with the object", () => {
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
	  test("POST: 400 - responds with an appropriate status and error message when provided with the object without correct keys", () => {
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
	