
export enum Platform {
   DESKTOP,
   TABLET,
   MOBILE
}

export enum Translation {
   EN = 'en',
   RU = 'ru'
}

export class UIState {
   currentPlatform: Platform = Platform.DESKTOP
   sideBarVisible: boolean = true
   isSignInPage: boolean = true
   locale: Translation = Translation.EN
}
