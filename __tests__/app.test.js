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