import {expect} from 'chai'
import sinon from 'sinon'
import {fetchData} from "../src/fetcher"

describe('fetchData', function () {
    it('Should perform fetch normally', async function () {
        const fetcher = sinon.fake.returns({ test: true });
        const config = {
            method: 'GET',
            url: 'test'
        }

        const response = await fetchData(fetcher, {}, config, {})

        expect(response).to.have.property('test')

        expect(fetcher.called)
        expect(fetcher.calledWithMatch(config))
    })

    it('Should parse returned value', async function () {
        const fetcher = sinon.fake.returns({ test: { nested: true } });
        const config = {
            method: 'GET',
            url: 'test'
        }

        const response = await fetchData(fetcher, {
            afterResponse: data => data.test
        }, config, {})

        expect(response).to.not.have.property('test')
        expect(response).to.have.property('nested')

        expect(fetcher.called)
        expect(fetcher.calledWithMatch(config))
    })

    it('Should perform fetch normally', async function () {
        const fetcher = sinon.fake.returns({ test: true });
        const config = {
            method: 'GET',
            url: 'test'
        }

        const response = await fetchData(fetcher, {
            beforeRequest: config => ({...config, url: 'newurl'})
        }, config, {})

        expect(response).to.have.property('test')

        expect(fetcher.called)
        expect(fetcher.calledWithMatch({...config, url: 'newurl'}))
    })

    it('Should perform fetch normally without config', async function () {
        const fetcher = sinon.fake.returns({ test: true });
        const config = {
            method: 'GET',
            url: 'test'
        }

        const response = await fetchData(fetcher, undefined, config, undefined)

        expect(response).to.have.property('test')

        expect(fetcher.called)
        expect(fetcher.calledWithMatch({...config, url: 'newurl'}))
    })
})