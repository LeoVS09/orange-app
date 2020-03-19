import { AosFieldType } from "@/abstractObjectScheme"
import { generateQueryList, generateQueryEntityById } from '@/lazyDB/connectors/queryMapper'
import cons from "../../utils/console.mock"

describe('Mapper AOS scheme to graphql query', () => {

    beforeEach(() => {
        cons.mockConsole()
    })

    afterEach(() => {
        cons.restoreConsole()
    })

    it('should generate query for read list of entities', () => {
        const entity = 'country'
        const fields = [{
            entity: "nodes",
            type: AosFieldType.OneToOne,
            fields: ["name","code","updatedAt"]
        }]

        const query = generateQueryList(entity, fields)

        expect(query).toMatchSnapshot()
    })

    
    it('should generate query for read entity by id with one to many links', () => {
        const entity = 'country'
        const fields = [
            "createdAt",
            "updatedAt",
            "name",
            {
                entity: "cities",
                type: AosFieldType.OneToMany,
                fields: ["name","updatedAt"]
            }
        ]

        const query = generateQueryEntityById(entity, fields)

        expect(query).toMatchSnapshot()
    })

    it('should generate query for read entity by id with one to one link', () => {
        const entity = 'city'
        const fields = [
            "createdAt",
            "updatedAt",
            "name",
            {
                entity: "country",
                type: AosFieldType.OneToOne,
                fields: ["name","updatedAt"]
            }
        ]

        const query = generateQueryEntityById(entity, fields)

        expect(query).toMatchSnapshot()
    })
})

