const request = require('supertest')
const app = require('../../app.js')

describe('Test GET /launches', () => {
    test('Should respond with 200 success', async () => {
        const response = await request(app)
            .get('/launches')
            .expect('Content-Type', /json/)
            .expect(200)
        // expect(response.statusCode).toBe(200)
    })
})

describe('Test POST /launches', () => {

    const completeTestObject = {
        mission: 'USS Enterprise',
        rocket: 'Falcon 9',
        target: "Kepler",
        launchDate: "January 4, 2023"
    }



    const noDateObject = {
        mission: 'USS Enterprise',
        rocket: 'Falcon 9',
        target: "Kepler",
    }

    const invalidDateObject = {
        ...noDateObject,
        launchDate: 'I am an invalid date'
    }

    test('Should respond with 200 success', async () => {
        const response = await request(app)
            .post('/launches')
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
            .post('/launches')
            .send(noDateObject)
            .expect('Content-Type', /json/)
            .expect(400)

        // response.body json check
        expect(response.body).toStrictEqual({ error: 'Missing required launch property' })
    })

    test('Should catch invalid dates', async () => {
        const response = await request(app)
            .post('/launches')
            .send(invalidDateObject)
            .expect('Content-Type', /json/)
            .expect(400)
        // response.body json check
        expect(response.body).toStrictEqual({ error: 'Invalid launch date' })

    })
})