import ApolloClient from "apollo-boost";
import * as actionTypes from '../actionTypes';
import * as API from '../../api';
import {
  IActionContext,
  APIState
} from "../../state";

const SET_CLIENT = 'SET_CLIENT';

const initState: APIState = {
  client: API.makeApiClient()
};

export default {
  state: initState,

  actions: {
    [actionTypes.SET_CLIENT](context: IActionContext<APIState>, client: ApolloClient<any>){
      context.commit(SET_CLIENT, client);
    }
  },

  mutations: {
    [SET_CLIENT](state: APIState, client: ApolloClient<any>) {
      state.client = client;
    }
  }
}
