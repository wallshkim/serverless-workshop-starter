const assert = require("assert")
const lambda = require('../src/index')

describe("basic invocation", () => {
    it("invokes the handler", async () => {
        // arrange
        const event = {beef: "delicious"}
        
        // act
        const response = await lambda.handler(event)

        // assert
        console.log(response)
        assert.equal(response.body, JSON.stringify(event))
    })
})