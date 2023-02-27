const request = require('supertest')
const app = require('../../app.js')
const {
    mongoConnect,
    mongoDisconnect
} = require('../../services/mongo')


const API_VERSION = '/v1'

describe('Launch API', () => {


    beforeAll(async () => {
        await mongoConnect()
    })

    afterAll(async () => {
        await mongoDisconnect()
    })

    describe('Test GET /launches', () => {
        test('Should respond with 200 success', async () => {
            const response = await request(app)
                .get(`${API_VERSION}/launches`)
                .expect('Content-Type', /json/)
                .expect(200)
            // expect(response.statusCode).toBe(200)
        })
    })

    describe('Test POST /launches', () => {

        const completeTestObject = {
            mission: 'USS Enterprise',
            rocket: 'Falcon 9',
            target: "Kepler-442 b",
            launchDate: "January 4, 2023"
        }



        const noDateObject = {
            mission: 'USS Enterprise',
            rocket: 'Falcon 9',
            target: "Kepler-442 b",
        }

        const invalidDateObject = {
            ...noDateObject,
            launchDate: 'I am an invalid date'
        }

        test('Should respond with 200 success', async () => {
            const response = await request(app)
                .post(`${API_VERSION}/launches`)
                .send(completeTestObject)
                .expect('Content-Type', /json/)
                .expect(201)

            const requestDate = new Date(completeTestObject.launchDate).valueOf()
            const responseDate = new Date(response.body.launchDate).valueOf()
            expect(responseDate).toBe(requestDate)
            expect(response.body).toMatchObject(noDateObject)
        })

        test('Should catch missing required properties', async () => {
            const response = await request(app)
                .post(`${API_VERSION}/launches`)
                .send(noDateObject)
                .expect('Content-Type', /json/)
                .expect(400)

            // response.body json check
            expect(response.body).toStrictEqual({ error: 'Missing required launch property' })
        })

        test('Should catch invalid dates', async () => {
            const response = await request(app)
                .post(`${API_VERSION}/launches`)
                .send(invalidDateObject)
                .expect('Content-Type', /json/)
                .expect(400)
            // response.body json check
            expect(response.body).toStrictEqual({ error: 'Invalid launch date' })

        })
    })
})