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

      const token = encryptId(user);

      if(isRemember){
        window.localStorage.setItem(TOKEN_NAME, token);
      } else {
        window.sessionStorage.setItem(TOKEN_NAME, token);
      }

      resolve(user);

    }, 1000)
  })
}

function encryptId(user: User): string {
  return JSON.stringify(user) // TODO
}

function decryptId(token: string): User {
  return JSON.parse(token) // TODO
}

export function signout () {
  window.localStorage.removeItem(TOKEN_NAME);
  window.sessionStorage.removeItem(TOKEN_NAME);
}

interface checkResultOk {
  user: User,
  ok: true
}

interface checkResultFalse {
  ok: false
}

export function checkIsLogin (): checkResultOk | checkResultFalse {
  let token = window.localStorage.getItem(TOKEN_NAME);
  if(!token){
    token = window.sessionStorage.getItem(TOKEN_NAME);
  }

  if(token == null || token[0] !== '{'){ // TODO: add real check
    return {ok: false};
  }

  return {
    user: decryptId(token),
    ok: true
  };
}
