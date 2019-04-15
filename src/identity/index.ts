import {User, UserType} from '../state';
import {createUser} from '../store/plugins/mock/generator'
import {login} from '../api'

const TOKEN_NAME = 'token';

export function signin(username: string, password: string, isRemember: boolean): Promise<User | null> {
  if (!username.length || !password.length) {
    return Promise.reject('Not have login or password');
  }

  return login({
    username,
    password
  })
    .then(userdata => {
      console.log('signin result', userdata)
      let user;
      if (username === 'teacher') {
        user = createUser(username, password, UserType.TEACHER);
      } else {
        user = createUser(username, password, UserType.CONTESTANT);
      }

      const token = encryptId(user);

      if (isRemember) {
        window.localStorage.setItem(TOKEN_NAME, token);
      } else {
        window.sessionStorage.setItem(TOKEN_NAME, token);
      }

      return user;
    })
}

function encryptId(user: User): string {
  return JSON.stringify(user) // TODO
}

function decryptId(token: string): User {
  return JSON.parse(token) // TODO
}

export function signout() {
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

export function checkIsLogin(): checkResultOk | checkResultFalse {
  let token = window.localStorage.getItem(TOKEN_NAME);
  if (!token) {
    token = window.sessionStorage.getItem(TOKEN_NAME);
  }

  if (token == null || token[0] !== '{') { // TODO: add real check
    return {ok: false};
  }

  return {
    user: decryptId(token),
    ok: true
  };
}
