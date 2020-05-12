// const isDevelopment = process.env.NODE_ENV !== 'production'

// TODO: merge all api to one gate

const urls = {
  ORANGE_MANAGER_SERVER: '/judge',
  DATABASE_SERVER: '/graphql', // !isDevelopment ? 'http://localhost:8765/graphql' : 'http://localhost:4000/graphql',
  RUN_PROGRAM: '/run'
}

export default urls
