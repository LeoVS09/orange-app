import cons from "../../utils/console.mock"

jest.mock('graphql-tag');

describe('Mapper AOS scheme to graphql query', () => {

    // Should be inside for mock graphql-tag
    const { generateQueryList, generateQueryEntityById } = require('@/lazyDB/connectors/queryMapper')

    beforeEach(() => {
        cons.mockConsole()
    })

    afterEach(() => {
        cons.restoreConsole()
    })

    it('should generate query for read list of entities', () => {
        const entity = 'country'
        const fields = [{
            nodes: ["name", "code", "updatedAt", "id", "nodeId", ]
        }]

        const query = generateQueryList(entity, fields)

        expect(query).toMatchSnapshot()
    })


    it('should generate query for read list of entities without id', () => {
        const entity = 'country'
        const fields = [{
            nodes: ["name", "code", "updatedAt"]
        }]

        const query = generateQueryList(entity, fields)

        expect(query).toMatchSnapshot()
    })

    it('should generate query for read list of entities without only nodeId', () => {
        const entity = 'country'
        const fields = [{
            nodes: ["name", "id",  "code", "updatedAt"]
        }]

        const query = generateQueryList(entity, fields)

        expect(query).toMatchSnapshot()
    })

    it('should generate query for read list of entities without only id', () => {
        const entity = 'country'
        const fields = [{
            nodes: ["name", "nodeId", "code", "updatedAt"]
        }]

        const query = generateQueryList(entity, fields)

        expect(query).toMatchSnapshot()
    })



    it('should generate query for read entity by id with one to many links', () => {
        const entity = 'country'
        const fields = [
            "createdAt",
            "updatedAt",
            "nodeId",
            "id",
            "name",
            {
                cities: ["id", "name","nodeId",  "updatedAt"]
            }
        ]

        const query = generateQueryEntityById(entity, fields)

        expect(query).toMatchSnapshot()
    })

    it('should generate query for read entity by id with one to many links without parent id', () => {
        const entity = 'country'
        const fields = [
            "createdAt",
            "updatedAt",
            "name",
            {
                cities: ["id", "nodeId", "name", "updatedAt"]
            }
        ]

        const query = generateQueryEntityById(entity, fields)

        expect(query).toMatchSnapshot()
    })

    it('should generate query for read entity by id with one to many links without child id', () => {
        const entity = 'country'
        const fields = [
            "id",
            "nodeId",
            "createdAt",
            "updatedAt",
            "name",
            {
                cities: ["name", "updatedAt"]
            }
        ]

        const query = generateQueryEntityById(entity, fields)

        expect(query).toMatchSnapshot()
    })


    it('should generate query for read entity by id with one to one link', () => {
        const entity = 'city'
        const fields = [
            "id",
            "nodeId",
            "createdAt",
            "updatedAt",
            "name",
            {
                country: ["id", "nodeId", "name", "updatedAt"]
            }
        ]

        const query = generateQueryEntityById(entity, fields)

        expect(query).toMatchSnapshot()
    })

    it('should generate query for read entity by id with one to one link wihout id', () => {
        const entity = 'city'
        const fields = [
            "createdAt",
            "updatedAt",
            "name",
            {
                country: ["name", "updatedAt"]
            }
        ]

        const query = generateQueryEntityById(entity, fields)

        expect(query).toMatchSnapshot()
    })
})

