
export enum Platform {
   DESKTOP,
   TABLET,
   MOBILE
}

export class UIState {
   currentPlatform: Platform = Platform.DESKTOP
   sideBarVisible: boolean = true
   isSignInPage: boolean = true
}
