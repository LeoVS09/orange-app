import {User, UserType} from '../state';
import {login, currentUser} from '../api'
// @ts-ignore
import crypto from 'crypto-js'
import {ILogin} from "@/api/graphql/mutations";

const TOKEN_NAME = 'token';

export function signin(username: string, password: string, isRemember: boolean): Promise<User | null> {
   if (!username.length || !password.length) {
      return Promise.reject('Not have login or password');
   }

   return login({
      username,
      password
   })
      .then(userData => {
         console.log('signin result', userData)
         if (!userData)
            throw new Error('Cannot login')
         let user = toUser(userData);

         const token = encryptId(user);

         if (isRemember) {
            window.localStorage.setItem(TOKEN_NAME, token);
         } else {
            window.sessionStorage.setItem(TOKEN_NAME, token);
         }

         return user;
      })
}

function toUser(userData: ILogin['login']['user']): User {
   if (!userData.profiles.nodes.length)
      throw new Error('User not have profile')

   const profile = userData.profiles.nodes[0]
   return {
      id: userData.id,
      login: userData.name,
      isAdmin: userData.isAdmin,
      avatarUrl: userData.avatarUrl,
      emails: userData.userEmails.nodes,
      firstName: profile.firstName,
      lastName: profile.lastName,
      familyName: profile.familyName,
      type: profile.isTeacher ? UserType.TEACHER : UserType.CONTESTANT,
      course: profile.course,
      groupNumber: profile.groupNumber,
      university: profile.university,
      city: profile.city,
      phone: profile.phone,
      languages: [],
      codeEditors: [],
      travel: []
   }
}

function encryptId(user: User): string {
   return crypto.AES.encrypt(user.id, 'key') // TODO
}

function decryptId(token: string): string {
   return crypto.AES.decrypt(token, 'key') // TODO
}

export function signout() {
   window.localStorage.removeItem(TOKEN_NAME);
   window.sessionStorage.removeItem(TOKEN_NAME);
}

interface checkResultOk {
   userId: string,
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

   if (token == null) { // TODO: add real check
      return {ok: false};
   }

   return {
      userId: decryptId(token),
      ok: true
   };
}

interface currentUserOk {
   user: User,
   ok: true
}

interface currentUserFalse {
   ok: false
}

export async function currentUserIfHave(): Promise<currentUserOk | currentUserFalse> {
   const userData = await currentUser()
   if (!userData)
      return {
         ok: false
      }

   return {
      user: toUser(userData),
      ok: true
   }
}
