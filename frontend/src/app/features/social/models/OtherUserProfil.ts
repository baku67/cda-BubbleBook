import { PrivacyOption } from "../../profil/models/privacy-option";

export interface OtherUserProfil {
    username: string;
    email?: string;
    accountType: string,
    nationality: string,
    avatarUrl: string,
    bannerUrl: string,
    initialDivesCount: number,
    
    profilPrivacy: PrivacyOption;
    logBooksPrivacy: PrivacyOption;
    certificatesPrivacy: PrivacyOption;
    galleryPrivacy: PrivacyOption;
}
