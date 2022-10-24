import {expect} from 'chai'
import {parseIfAvailable} from "../src/utils"

describe('parseIfAvailable', function () {
    it('Should execute function without params', function () {
        const result = parseIfAvailable(() => {
            return true
        }, null)

        expect(result).to.equal(true)
    })

    it('Should execute function with passing params', function () {
        const result = parseIfAvailable((firstParam, secondParam) => {
            return {
                firstParam,
                secondParam
            }
        }, null, "first", true)

        expect(result.firstParam).to.equal("first")
        expect(result.secondParam).to.equal(true)
    })

    it('Should return value if not function', function () {
        const result = parseIfAvailable("test")

        expect(result).to.equal("test")
    })

    it('Should return undefined if empty', function () {
        const result = parseIfAvailable(undefined, null)

        expect(result).to.equal(undefined)
    })

    it('Should return fallback if empty', function () {
        const result = parseIfAvailable(undefined, "fallback")

        expect(result).to.equal("fallback")
    })

    it('Should return fallback if function returns empty', function () {
        const result = parseIfAvailable(() => undefined, "fallback")

        expect(result).to.equal("fallback")
    })
})