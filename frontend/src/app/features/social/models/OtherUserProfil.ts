import { PrivacyOption } from "../../profil/models/privacy-option";

// Quand on click sur un result search avec link userID
export interface OtherUserProfil {
    username: string;
    accountType: string,
    avatarUrl: string,
    bannerUrl: string,
    nationality?: string,
    initialDivesCount?: number,
    

    // ajouter les ?Carnets (filtré via privacySettings dans query)

    // ajouter les ?Certificates (filtré via privacySettings dans query)

    // ajouter les ?Gallerie(MediasURLs?) (filtrés via privacySettings dans query)

}
