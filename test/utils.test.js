import {expect} from 'chai'
import {parseIfAvailable} from "../src/utils"

describe('parseIfAvailable', function () {
    it('Should execute function without params', async function () {
        const result = await parseIfAvailable(() => {
            return true
        }, null)

        expect(result).to.equal(true)
    })

    it('Should execute function with passing params', async function () {
        const result = await parseIfAvailable((firstParam, secondParam) => {
            return {
                firstParam,
                secondParam
            }
        }, null, "first", true)

        expect(result.firstParam).to.equal("first")
        expect(result.secondParam).to.equal(true)
    })

    it('Should return value if not function', async function () {
        const result = await parseIfAvailable("test")

        expect(result).to.equal("test")
    })

    it('Should return undefined if empty', async function () {
        const result = await parseIfAvailable(undefined, null)

        expect(result).to.equal(undefined)
    })

    it('Should return fallback if empty', async function () {
        const result = await parseIfAvailable(undefined, "fallback")

        expect(result).to.equal("fallback")
    })

    it('Should return fallback if function returns empty', async function () {
        const result = await parseIfAvailable(() => undefined, "fallback")

        expect(result).to.equal("fallback")
    })
})