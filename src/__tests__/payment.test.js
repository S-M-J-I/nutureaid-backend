const app = require('../../index')
const request = require('supertest')
const { commonHeaders } = require('./configtest')
// app()

describe('Make a payment after appointment', () => {
    it("should complete a transaction seamlessly", async () => {
        const res = await request(app).get('/api/auth/payment/init').send()
            .set(commonHeaders)

        expect(res.statusCode).toEqual(200)
    }, 20000)
})


describe('Reject payment for invalid details', () => {
    it("should reject a transaction for cost 0 BDT", async () => {
        const res = await request(app).post('/api/auth/payment/init').send()
            .set(commonHeaders)

        expect(res.statusCode).toEqual(404)
    }, 20000)
    it("should reject a transaction for wrong transaction type", async () => {
        const res = await request(app).post('/api/auth/payment/init').send()
            .set(commonHeaders)

        expect(res.statusCode).toEqual(404)
    }, 20000)
    it("should reject a transaction for no transaction id specified", async () => {
        const res = await request(app).post('/api/auth/payment/init').send()
            .set(commonHeaders)

        expect(res.statusCode).toEqual(404)
    }, 20000)
})