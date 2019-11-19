import { Database } from './connected/Database'
import { makeConnectedRepositoryClass } from '@/lazyDB/database/connected/Repository'
import { getStore } from '@/lazyDB/core/common'
import { appendToWindow } from './utils'

// Global default database
// Only for simplified usage of library

const db = new Database()

export default db

appendToWindow({ db })

// Connected to global db entity repository
class Repository extends makeConnectedRepositoryClass(db) {

}

export {
  db,
  Repository,
}

const store = getStore(db.storage)

store.stream!.subscribe(event => console.log('global store debug', event))
