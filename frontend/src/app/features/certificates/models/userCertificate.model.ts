import { Certificate } from "./certificate.model";

export interface UserCertificate {
    certificate: Certificate
    obtainedAt: string | null,
    location: string | null;
}