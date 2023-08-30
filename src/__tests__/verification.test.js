const app = require('../../index')
const request = require('supertest')
const { example_user_id } = require('./configtest')

describe('Verify a user', () => {
    it("should accept the verification", async () => {
        const res = await request(app).post(`/api/auth/verification/update/${example_user_id}`).send({
            status: true
        })

        expect(res.statusCode).toEqual(200)
        expect(res.body.message).toEqual("Approved")
    }, 20000)
    it("should reject the verification", async () => {
        const res = await request(app).post(`/api/auth/verification/update/${example_user_id}`).send({
            status: false
        })

        expect(res.statusCode).toEqual(200)
        expect(res.body.message).toEqual("Rejected")
    }, 20000)
})
