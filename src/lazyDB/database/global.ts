import {Database} from "./Database";
import {makeConnectedRepositoryClass} from "@/lazyDB/database/Repository";
import {getStore} from "@/lazyDB/core/common";

// Global default database
// Only for simplified usage of library

const db = new Database()

export default db

// Connected to global db entity repository
class Repository extends makeConnectedRepositoryClass(db) {

}

export {
   db,
   Repository
}


const store = getStore(db.storage)

store.stream!.subscribe(event => console.log(event))
