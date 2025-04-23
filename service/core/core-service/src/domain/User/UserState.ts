export interface UserState {
  id: string
  preferences: {
    actOnInsert: boolean
    colorScheme: "system" | "light" | "dark"
    jumpToNextPick: boolean
    previewOnHover: boolean
  }
}
