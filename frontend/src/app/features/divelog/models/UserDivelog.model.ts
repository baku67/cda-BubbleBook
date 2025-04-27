export interface UserDivelog {
    id: number;
    title: string;
    description: string | null;
    createdAt: string;
    theme: string;
    diveCount: number;
}