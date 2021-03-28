const request = require('supertest');
const Article = require("../../models/article");
const mongoose = require("mongoose");

let server;

// Integration test suite for Articles 
describe('/Articles', () => {
    beforeEach(() => { server = require('../../app'); })
    afterEach(() => {server.close(); });

        // GET all articles from DATABASE and return it to the user
        describe('GET /', () => {
            it ('should return all articles for user', async () => {
                const res = await request(server).get('/blog/articles_user');
                expect(res.status).toBe(200);
                });
            });
        });

        // GET specific article from database by it's ttitle and return it to the user
        describe('GET /title', () => {
            it ('should return the article for user, by its title through (SLUG)', async () => {
                // Create new article for testing porpuse
                await Article.collection.insertMany([
                    {   createdAt: new Date(),
                        title: "integrationTest1",
                        description: "testing create new article and return it by it's slug to the user",
                        markdown: "ldskfhlds fhlsdhflshdf lsdhfls hdflsdhflshdflhsd fl",
                        slug: "integrationTest1",
                        sanitizedHtml: "<p>ldskfhlds fhlsdhflshdf lsdhfls hdflsdhflshdflhsd fl</p>",
                    },
                ]);
                // Return the new testing article to the user by calling it's name (slug)
                const res = await request(server).get('/articles/1/integrationTest1');
                expect(res.status).toBe(200);
            });
        });
