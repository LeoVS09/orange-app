import ApolloClient, {MutationOptions, FetchResult, OperationVariables, QueryOptions, ApolloQueryResult} from "apollo-boost";

export interface APIClient {
  mutate<T, TVariables = OperationVariables>(options: MutationOptions<T, TVariables>): Promise<FetchResult<T>>
  query<T, TVariables = OperationVariables>(options: QueryOptions<TVariables>): Promise<ApolloQueryResult<T>>;
}

export function makeClient(uri: string): APIClient {
  const client = new ApolloClient({
    uri,
    credentials: "include"
  });

  return {
    mutate: options => client.mutate(options),
    query: options => client.query(options)
  };
}
