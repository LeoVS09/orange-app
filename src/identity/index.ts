import {User, UserType} from '../state';
import {createUser} from '../store/plugins/mock/generator'

const TOKEN_NAME = 'token';

export function signin (login: string, password: string, isRemember: boolean): Promise<User | null> {
  if(!login.length || !password.length){
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let user;
      if(login === 'teacher') {
        user = createUser(login, password, UserType.TEACHER);
      } else {
        user = createUser(login, password, UserType.CONTESTANT);
      }

      const token = encryptId(user.id);

      if(isRemember){
        window.localStorage.setItem(TOKEN_NAME, token);
      } else {
        window.sessionStorage.setItem(TOKEN_NAME, token);
      }

      resolve(user);

    }, 1000)
  })
}

function encryptId(id: string): string {
  return id // TODO
}

function decryptId(token: string): string {
  return token // TODO
}

export function signout () {
  window.localStorage.removeItem(TOKEN_NAME);
  window.sessionStorage.removeItem(TOKEN_NAME);
}

interface checkResult {
  id: string,
  ok: boolean
}

export function checkIsLogin (): checkResult {
  let token = window.localStorage.getItem(TOKEN_NAME);
  if(!token){
    token = window.sessionStorage.getItem(TOKEN_NAME);
  }

  if(token== null){ // TODO: add real check
    return {ok: false, id: ''};
  }

  return {
    id: decryptId(token),
    ok: true
  };
}
