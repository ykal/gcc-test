import { Component, OnInit } from "@angular/core";
import { CertificationService } from "../certification.service";
import { AuthService } from "../../Auth/services/auth.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "request-certification",
  templateUrl: "requestCertification.component.html",
  styleUrls: ["requestCertification.component.css"]
})
export class RequestCertificationComponent implements OnInit {
  public request: any = { file1: {}, file2: {}, file3: {}, file4: {} };
  public requests: any = [];
  public requestForm: FormGroup;

  constructor(
    public service: CertificationService,
    public authService: AuthService,
    public fb: FormBuilder,
    public router: Router
  ) {}

  ngOnInit() {
    this.requestForm = this.fb.group({
      file1: ["", Validators.required],
      file2: ["", Validators.required],
      file3: ["", Validators.required],
      file4: ["", Validators.required]
    });
    this.getMyRequests();
  }

  submitRequest() {
    this.request.userId = this.authService.getUserId();
    this.service.requestCertification(this.request).subscribe(res => {
      console.log("Submitted!!");
      this.router.navigate([""]);
    });
  }

  getMyRequests() {
    this.service.getMyRequests(this.authService.getUserId()).subscribe(res => {
      this.requests = res;
    });
  }
}
