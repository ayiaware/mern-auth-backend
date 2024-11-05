const request = require('supertest');
const { app } = require('../server'); // Adjust the path as necessary
const mongoose = require('mongoose');
const User = require('../models/userModel'); // Adjust the path as necessary

// Test user data for signup and login
const testUser = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Password123!'
};

beforeEach(async () => {
    // Clean the database before each test
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});



describe('User Routes', () => {
    it('should return welcome message on GET /', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.body.mssg).toBe('Welcome to app');
    });
});


describe('Authentication Route-Level', () => {
    it('should not sign up a user without a name', async () => {
        const res = await request(app)
            .post('/api/user/signup')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(res.statusCode).toEqual(400);

        expect(res.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: 'Name is required',
                    path: 'name',
                }),
            ])
        );
        // expect(res.body).toHaveProperty('error', 'All fields must be filled'); // Updated message

    });

    it('should not sign up a user with an invalid email', async () => {
        const res = await request(app)
            .post('/api/user/signup')
            .send({
                name: testUser.name,
                email: 'invalid-email', // Invalid email format
                password: testUser.password
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: 'Please provide a valid email',
                    path: 'email',
                }),
            ])
        );
        // expect(res.body).toHaveProperty('error', 'Invalid email format'); // Updated message
    });
});

describe('Authentication Model-based', () => {

    it('should sign up a new user', async () => {
        const res = await request(app)
            .post('/api/user/signup')
            .send(testUser);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should not sign up a user with an existing email', async () => {
        await request(app)
            .post('/api/user/signup')
            .send(testUser); // Register the user first

        const res = await request(app)
            .post('/api/user/signup')
            .send(testUser); // Try to register again

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Email already in use');
    });

    it('should log in an existing user', async () => {
        await request(app)
            .post('/api/user/signup')
            .send(testUser); // Register the user first

        const res = await request(app)
            .post('/api/user/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should not log in with invalid credentials', async () => {
        await request(app)
            .post('/api/user/signup')
            .send(testUser); // Register the user first

        const res = await request(app)
            .post('/api/user/login')
            .send({
                email: testUser.email,
                password: 'wrongPassword' // Invalid password
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Incorrect password');
    });
});
