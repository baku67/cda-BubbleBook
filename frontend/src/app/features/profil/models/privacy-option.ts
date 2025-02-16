export enum PrivacyOption {
  ALL = 'ALL',
  FRIENDS_ONLY = 'FRIENDS_ONLY',
  NO_ONE = 'NO_ONE',
}

export class PrivacyOptionHelper {
  static getOptions(): { label: string; value: PrivacyOption }[] {
    return [
      { label: 'PRIVACY.ALL', value: PrivacyOption.ALL },
      { label: 'PRIVACY.FRIENDS_ONLY', value: PrivacyOption.FRIENDS_ONLY },
      { label: 'PRIVACY.NO_ONE', value: PrivacyOption.NO_ONE },
    ];
  }
}
