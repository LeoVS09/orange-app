export interface ResponseDataProfile {
   id: string,
   firstName: string,
   lastName: string,
   familyName: string,
   phone: string,
   groupNumber: string,
   course: number,
   isTeacher: boolean,
   createdAt: Date,
   updatedAt: Date,
   city: {
      id: string,
      name: string
   },
   university: {
      id: string,
      shortName: string,
      longName: string
   }
}

export interface ResponseDataUserEmail {
   email: string
   isVerified: boolean
   createdAt: Date
   updatedAt: Date
}

export interface ResponseDataUser {
   id: string
   name: string
   isAdmin: boolean
   avatarUrl: string
   userEmails: {
      nodes: Array<ResponseDataUserEmail>
   },

   profiles: {
      nodes: Array<ResponseDataProfile>
   }
}

export interface ResponseLogin {
   login: {
      user: ResponseDataUser
   }
}

export interface ResponseRegister {
   register: {
      user: ResponseDataUser
   }
}

export interface RequestRegisterInput {
   username: string,
   email: string,
   password: string,
   name: string,
   avatarUrl?: string,
   firstName: string,
   middleName?: string
   lastName?: string
}

export interface RequestLoginInput {
   username: string,
   password: string
}
