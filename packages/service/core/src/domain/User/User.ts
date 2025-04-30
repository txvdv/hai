import { createUUID } from '@hai/common-utils';
import { UserID } from './UserID.js';
import { UserPreferences } from './UserPreferences.js';
import { UserState } from './UserState.js';

export class User {
  private id: UserID;
  private preferences: UserPreferences;

  getIdentifier(): UserID {
    return this.id;
  }

  getState(): UserState {
    return {
      id: this.id.toString(),
      preferences: this.preferences.getState(),
    };
  }

  private constructor(params: { id: UserID; preferences: UserPreferences }) {
    this.id = params.id;
    this.preferences = params.preferences;
  }

  static fromState(state: UserState): User {
    const id = UserID.of(state.id);
    const preferences = UserPreferences.fromState(state.preferences);
    return new User({ id, preferences });
  }

  static withDefaultPreferences(): User {
    const id = UserID.of(createUUID());
    const preferences = UserPreferences.withDefaultPreferences();
    return new User({ id, preferences });
  }

  updatePreferences(preferences: UserPreferences) {
    this.preferences = preferences;
  }
}
