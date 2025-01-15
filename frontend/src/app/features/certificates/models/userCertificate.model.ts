import { Certificate } from "./certificate.model";

export interface UserCertificate {
    certificate: Certificate
    obtainedDate: string | null,
    location: string | null;
}