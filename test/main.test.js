import {expect} from 'chai'
import sinon from 'sinon'
import apiConf from "../src/main"

describe('apiConf', function () {
    it('Should initialize correctly', async function () {
        const fetcher = sinon.fake.returns({ test: true });
        const config = {
            method: 'GET',
            url: 'test'
        }

        const api = apiConf(fetcher, {})

        const route = api({
            method: 'GET',
            url: 'test/test2'
        })

        const response = await route()

        expect(response).to.have.property('test')

        expect(fetcher.called)
        expect(fetcher.calledWithMatch(config))
    })
})