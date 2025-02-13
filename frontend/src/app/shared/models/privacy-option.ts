export enum PrivacyOption {
    ALL = 'tout le monde',
    FRIENDS_ONLY = 'amis uniquement',
    NO_ONE = 'aucun',
  }
  
  // Utilitaires pour afficher un label ou obtenir une description
  export class PrivacyOptionHelper {
    static getLabel(option: PrivacyOption): string {
      switch (option) {
        case PrivacyOption.ALL:
          return 'Tout le monde';
        case PrivacyOption.FRIENDS_ONLY:
          return 'Amis uniquement';
        case PrivacyOption.NO_ONE:
          return 'Aucun';
        default:
          return '';
      }
    }
  
    static getDescription(option: PrivacyOption): string {
      switch (option) {
        case PrivacyOption.ALL:
          return 'Votre contenu est visible par tout le monde.';
        case PrivacyOption.FRIENDS_ONLY:
          return 'Seuls vos amis peuvent voir ce contenu.';
        case PrivacyOption.NO_ONE:
          return 'Personne ne peut voir ce contenu.';
        default:
          return '';
      }
    }
  
    static getOptions(): { label: string; value: PrivacyOption }[] {
      return [
        { label: 'Tout le monde', value: PrivacyOption.ALL },
        { label: 'Amis uniquement', value: PrivacyOption.FRIENDS_ONLY },
        { label: 'Aucun', value: PrivacyOption.NO_ONE },
      ];
    }
  }
  