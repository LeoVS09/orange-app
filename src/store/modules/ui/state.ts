
export enum Platform {
   DESKTOP,
   TABLET,
   MOBILE,
}

export enum Translation {
   EN = 'en',
   RU = 'ru',
}

export class UIState {
   public currentPlatform: Platform = Platform.DESKTOP
   public sideBarVisible: boolean = true
   public isSignInPage: boolean = true
   public locale: Translation = Translation.EN
}
