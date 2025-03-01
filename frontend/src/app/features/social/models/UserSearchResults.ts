export interface UserSearchResults {
    id: number;
    username: string;
    nationality?: string;
    avatarUrl?: string;
    bannerUrl?: string;
    initialDivesCount?: number;
    accountType: string;

    countryName?: string;
    flagSvgUrl?: string;
}
