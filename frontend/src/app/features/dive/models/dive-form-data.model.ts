export interface DiveFormData {
    divelogId: number;      // ID du Divelog auquel la plongée est associée
    title: string,
    description?: string,
    createdAt: Date,
    // ...
}