const isDevelopment = process.env.NODE_ENV !== 'production'

const urls = {
  ORANGE_MANAGER_SERVER: '/judge',
  DATABASE_SERVER: !isDevelopment ? 'http://localhost:8765/graphql' : 'http://localhost:4000/graphql',
  RUN_PROGRAM: '/run'
}

export default urls
