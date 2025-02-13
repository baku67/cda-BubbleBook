export enum PrivacyOption {
  ALL = 'ALL',
  FRIENDS_ONLY = 'FRIENDS_ONLY',
  NO_ONE = 'NO_ONE',
}

export class PrivacyOptionHelper {
  static getTranslationKey(option: PrivacyOption): string {
    switch (option) {
      case PrivacyOption.ALL:
        return 'PRIVACY.ALL';
      case PrivacyOption.FRIENDS_ONLY:
        return 'PRIVACY.FRIENDS_ONLY';
      case PrivacyOption.NO_ONE:
        return 'PRIVACY.NO_ONE';
      default:
        return '';
    }
  }

  static getOptions(): { value: PrivacyOption }[] {
    return [
      { value: PrivacyOption.ALL },
      { value: PrivacyOption.FRIENDS_ONLY },
      { value: PrivacyOption.NO_ONE },
    ];
  }
  
}
