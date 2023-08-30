const app = require('../../index')
const request = require('supertest');
const { example_user_tok, commonHeaders } = require('./configtest');
// app()



describe('Create an appointment', () => {
    it("should book an appointment", async () => {
        const res = await request(app).post('/api/auth/appointment/book/1').send({
            cost: 5000,
            booked_by: "HHH"
        })
            .set(commonHeaders)

        expect(res.statusCode).toEqual(201)
        expect(res.body.message).toEqual("Success")
    }, 20000)
})


describe('Reject an appointment', () => {
    it("should reject an appointment booking if `booked_by` user is empty", async () => {
        const res = await request(app).post('/api/auth/appointment/book/1').send({
            cost: 5000,
        })
            .set(commonHeaders)

        expect(res.statusCode).toEqual(500)
        expect(res.body.message).toEqual("Internal server error")
    }, 20000)
})


describe('Reject access to the API', () => {
    it("should reject access to the API if there's no auth token", async () => {
        const res = await request(app).post('/api/auth/appointment/book/1').send({
            cost: 5000,
        })

        expect(res.statusCode).toEqual(403)
        expect(res.body.message).toEqual("Forbidden")
    }, 20000)
})

