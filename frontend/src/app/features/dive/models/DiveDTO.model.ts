export interface DiveDTO {
    id: number;
    title: string;
    description?: string | null;
    diveDatetime: string;    // ISO 8601
    diveDuration: number;    // en minutes
    weight: number;          // en kg
    temperature?: number | null;
    visibility?: string | null;
    satisfaction?: number | null;
    tags: string[];
  }