import {User, UserType} from '../state';
import {createUser} from '../store/plugins/mock/generator'

const TOKEN_NAME = 'token';

export function signin (login: string, password: string, isRemember: boolean): Promise<User | null> {
  if(!login.length || !password.length){
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if(isRemember){
        window.localStorage.setItem(TOKEN_NAME, "LOL");
      } else {
        window.sessionStorage.setItem(TOKEN_NAME, "LOL");
      }

      if(login === 'teacher') {
        resolve(createUser(login, password, UserType.TEACHER));
      } else {
        resolve(createUser(login, password, UserType.CONTESTANT));
      }
    }, 1000)
  })
}

export function signout () {
  window.localStorage.removeItem(TOKEN_NAME);
  window.sessionStorage.removeItem(TOKEN_NAME);
}

export function checkIsLogin (): boolean {
  let token = window.localStorage.getItem(TOKEN_NAME);
  if(!token){
    token = window.sessionStorage.getItem(TOKEN_NAME);
  }

  if(!!token){ // TODO: add real check
    return true;
  }

  return false;
}
