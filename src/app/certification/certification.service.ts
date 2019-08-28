import { Injectable } from "@angular/core";
import { ApiService } from "../shared/services/api.service";

@Injectable()
export class CertificationService {

    constructor(public apiService: ApiService) {

    }

    requestCertification(request) {
        return this.apiService.post(`certifications/`, request);
    }

    getMyRequests(userId) {
        return this.apiService.get(`/UserAccounts/${userId}/certifications`);
    }
}
