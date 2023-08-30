const app = require('../../index')
const request = require('supertest')
const { commonHeaders, example_user_id, example_report_id } = require('./configtest')
// app()
const fs = require('fs')

// describe('Upload a report', () => {
//     it("should successfully upload a report", async () => {
//         const buff = fs.readFileSync(`${__dirname}/hi.txt`)
//         const res = await request(app).post(`/api/auth/reports/upload/${example_user_id}`).send()
//             .set(commonHeaders)
//             .attach("file", buff, "new_file.txt")


//         expect(res.statusCode).toEqual(201)
//         expect(res.body.message).toEqual("Success")
//     }, 20000)
// })


describe('Download a report', () => {
    it("should successfully download a report", async () => {
        const buff = fs.readFileSync(`${__dirname}/hi.txt`)
        const res = await request(app).get(`/api/auth/reports/get-id/${example_report_id}`).send()


        expect(res.statusCode).toEqual(200)
    }, 20000)
})