import { PrivacyOption } from "../../../shared/models/privacy-option";

export interface UserProfil {
    username: string;
    email: string;
    firstLoginStep: number;
    accountType: string,
    nationality: string,
    avatarUrl: string,
    bannerUrl: string,
    initialDivesCount: number,
    isVerified: boolean;
    is2fa: boolean;
    profilPrivacy: PrivacyOption;
    logBooksPrivacy: PrivacyOption;
    certificatesPrivacy: PrivacyOption;
    galleryPrivacy: PrivacyOption;
}
