import { Database } from './connected/Database'
import { makeConnectedRepositoryClass } from '@/lazyDB/database/connected/Repository'
import { getStore } from '@/lazyDB/core/common'

// Global default database
// Only for simplified usage of library

const db = new Database()

export default db

if (typeof (window) !== 'undefined') {
  // @ts-ignore
  window.db = db
  console.warn('Global db instance appended to window', db)
}

// Connected to global db entity repository
class Repository extends makeConnectedRepositoryClass(db) {

}

export {
  db,
  Repository,
}

const store = getStore(db.storage)

store.stream!.subscribe(event => console.log(event))
