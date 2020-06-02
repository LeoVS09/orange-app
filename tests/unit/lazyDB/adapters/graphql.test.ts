import cons from "../../utils/console.mock"

jest.mock('graphql-tag');

const queryByIdVariables = { id: { type: 'UUID', value: 1, required: true } }

describe('Mapper scheme to graphql query', () => {

    // Should be inside for mock graphql-tag
    const { generateQuery } = require('@/lazyDB/adapters/graphql')

    beforeEach(() => {
        cons.mockConsole()
    })

    afterEach(() => {
        cons.restoreConsole()
    })

    it('should generate query for read list of entities', () => {
        const operation = 'countries'
        const fields = [{
            nodes: ["name", "code", "updatedAt", "id", "nodeId", ]
        }]

        const query = generateQuery({ operation, fields })

        expect(query).toMatchSnapshot()
    })


    it('should generate query for read list of entities without id', () => {
        const operation = 'countries'
        const fields = [{
            nodes: ["name", "code", "updatedAt"]
        }]

        const query = generateQuery({ operation, fields })

        expect(query).toMatchSnapshot()
    })

    it('should generate query for read list of entities without only nodeId', () => {
        const operation = 'countries'
        const fields = [{
            nodes: ["name", "id",  "code", "updatedAt"]
        }]

        const query = generateQuery({ operation, fields })

        expect(query).toMatchSnapshot()
    })

    it('should generate query for read list of entities without only id', () => {
        const operation = 'countries'
        const fields = [{
            nodes: ["name", "nodeId", "code", "updatedAt"]
        }]

        const query = generateQuery({ operation, fields })

        expect(query).toMatchSnapshot()
    })



    it('should generate query for read entity by id with one to many links', () => {
        const operation = 'country'
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

        const query = generateQuery({ operation, fields, variables: queryByIdVariables })

        expect(query).toMatchSnapshot()
    })

    it('should generate query for read entity by id with one to many links without parent id', () => {
        const operation = 'country'
        const fields = [
            "createdAt",
            "updatedAt",
            "name",
            {
                cities: ["id", "nodeId", "name", "updatedAt"]
            }
        ]

        const query = generateQuery({ operation, fields, variables: queryByIdVariables })

        expect(query).toMatchSnapshot()
    })

    it('should generate query for read entity by id with one to many links without child id', () => {
        const operation = 'country'
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

        const query = generateQuery({ operation, fields, variables: queryByIdVariables })

        expect(query).toMatchSnapshot()
    })


    it('should generate query for read entity by id with one to one link', () => {
        const operation = 'city'
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

        const query = generateQuery({ operation, fields, variables: queryByIdVariables })

        expect(query).toMatchSnapshot()
    })

    it('should generate query for read entity by id with one to one link wihout id', () => {
        const operation = 'city'
        const fields = [
            "createdAt",
            "updatedAt",
            "name",
            {
                country: ["name", "updatedAt"]
            }
        ]

        const query = generateQuery({ operation, fields, variables: queryByIdVariables })

        expect(query).toMatchSnapshot()
    })
})

