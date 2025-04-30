import { UserPreferencesState } from './UserPreferencesState.js';

export class UserPreferences {
  private actOnInsert: boolean;
  private colorScheme: 'system' | 'light' | 'dark';
  private jumpToNextPick: boolean;
  private previewOnHover: boolean;

  getState() {
    return {
      actOnInsert: this.actOnInsert,
      colorScheme: this.colorScheme,
      jumpToNextPick: this.jumpToNextPick,
      previewOnHover: this.previewOnHover,
    };
  }

  private constructor(params: {
    actOnInsert: boolean;
    colorScheme: 'system' | 'light' | 'dark';
    jumpToNextPick: boolean;
    previewOnHover: boolean;
  }) {
    this.actOnInsert = params.actOnInsert;
    this.colorScheme = params.colorScheme;
    this.jumpToNextPick = params.jumpToNextPick;
    this.previewOnHover = params.previewOnHover;
  }

  static fromState(state: UserPreferencesState): UserPreferences {
    return new UserPreferences(state);
  }

  static withDefaultPreferences(): UserPreferences {
    return new UserPreferences({
      actOnInsert: true,
      colorScheme: 'system',
      jumpToNextPick: true,
      previewOnHover: false,
    });
  }
}
