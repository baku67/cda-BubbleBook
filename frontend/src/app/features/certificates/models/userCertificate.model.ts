import { Certificate } from "./certificate.model";

export interface UserCertificate {
    id: number;
    certificate: Certificate;
    displayOrder: number;
    obtainedDate: string | null;
    location: string | null;
}