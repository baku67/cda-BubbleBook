export interface OtherUserProfil {
    id: string,
    username: string,
    accountType: string,
    avatarUrl: string,
    bannerUrl: string,
    nationality?: string,
    initialDivesCount?: number,
    friendshipStatus?: string,
    divesCount: number,

    // Calcul de la possibilité de voir les infos pour l'utilisateur connecté
    canViewCertificates: boolean,
    canViewDivelogs: boolean,
    canViewGallery: boolean,
}
