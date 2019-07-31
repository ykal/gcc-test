import { Injectable } from "@angular/core";
import { ApiService } from "../../shared/services/api.service";
import { Resource } from "../models/resource";
import { FileUploader } from "ng2-file-upload";

@Injectable()
export class ResourcesService {
  public resources_path = "resources";

  constructor(public apiService: ApiService) {}

  getResources() {
    return this.apiService.get(this.resources_path);
  }

  getResource(id: string) {
    return this.apiService.get(`${this.resources_path}/${id}`);
  }

  deleteResource(id: string) {
    return this.apiService.delete(`${this.resources_path}/${id}`);
  }

  updateResource(id: string, resource: Resource) {
    return this.apiService.patch(`${this.resources_path}/${id}`, resource);
  }

  createResource(resource: Resource) {
    return this.apiService.post(`${this.resources_path}`, resource);
  }

  downloadResource(file) {
    return this.apiService.download(
      `storages/resources/download/${file}`,
      file
    );
  }
}
