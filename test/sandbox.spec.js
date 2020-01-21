const assert = require("assert")
const lambda = require('../src/index')
const sinon = require("sinon")

const mockHandler = async () => {
    return { 
        statusCode: 201, 
        body: JSON.stringify({ beef: "dubious" }) }
}


describe("sandbox demonstration", () => {

    it("invokes the mock handler", async () => {
        // arrange
        const event = { beef: "delicious" }

        sinon.stub(lambda, "handler").callsFake(mockHandler)

        // act
        const response = await lambda.handler(event)

        // assert
        console.log(response)
        assert.equal(response.body, JSON.stringify(event))
    })
})