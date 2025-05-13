export interface OtherUserProfil {
    id: string,
    username: string,
    accountType: string,
    avatarUrl: string,
    bannerUrl: string,
    nationality?: string,
    initialDivesCount?: number,

    // A remplacer par un boolean de resultat de calcul backend de si on a le droit ou pas de voir la section:
    logBooksPrivacy?: string,
    certificatesPrivacy?: string,
    galleryPrivacy?: string,

    friendshipStatus?: string,
    

    // ajouter les ?Carnets (filtré via privacySettings dans query)

    // ajouter les ?Certificates (filtré via privacySettings dans query)

    // ajouter les ?Gallerie(MediasURLs?) (filtrés via privacySettings dans query)
}
