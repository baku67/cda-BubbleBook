import { Certificate } from "./certificate.model";

export interface UserCertificate {
    certificate: Certificate;
    displayOrder: number;
    obtainedDate: string | null;
    location: string | null;
}