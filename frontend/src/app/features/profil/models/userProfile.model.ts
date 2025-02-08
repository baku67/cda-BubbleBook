export interface UserProfil {
    username: string;
    email: string;
    accountType: string,
    nationality: string,
    avatarUrl: string,
    bannerUrl: string,
    initialDivesCount: number,
    isVerified: boolean;
    is2fa: boolean;
    isPublic: boolean;
}
