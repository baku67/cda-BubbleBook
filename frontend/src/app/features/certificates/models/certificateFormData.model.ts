import { Organization } from "./organization.model";

export interface CertificateFormData {
    name: string,
    type: Organization,
    obtainedAt: Date,
    location: string,
}