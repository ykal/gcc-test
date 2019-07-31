import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SharedService } from "../../shared/services/shared.service";
import { WinnerProjectService } from "../winnerProject.service";
import { AuthService } from "../../Auth/services/auth.service";
import { CommonService } from "../../shared/services/common.service";
import { FileUploader, FileItem, ParsedResponseHeaders } from "ng2-file-upload";
import { configs } from "../../app.config";

@Component({
  selector: "app-add-competition-winner",
  templateUrl: "addCompetitionWinner.component.html",
  styleUrls: ["addCompetitionWinner.component.css"]
})
export class AddCompetitionWinnerComponent implements OnInit {
  public competitionWinner: any = { competitionId: "", projectId: "", city: '', thumnbinal: {} };
  public competitionWinnerForm: FormGroup;
  public projects = [];
  public projectsBackup = [];
  public competitions = [];
  public cities = [];
  public isUploading = false;
  public isFileSelected = false;
  public isCreateButtonClicked = false;
  public filePreviewPath: any = '';
  public progress = 0;
  private uploadUrl = `${configs.rootUrl}storages/winner-thumbinals/upload`;
  public uploader: FileUploader = new FileUploader({ url: this.uploadUrl });

  constructor(
    public service: WinnerProjectService,
    public fb: FormBuilder,
    public sharedService: SharedService,
    public competitionService: CommonService,
    public authService: AuthService,
    private sanitizer: DomSanitizer
  ) {
    this.competitionWinnerForm = this.fb.group({
      project: ["", Validators.required],
      competition: ["", Validators.required],
      city: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.fetchParams();
  }

  addCompetitionWinner() {
    this.isCreateButtonClicked = true;
    if (this.competitionWinnerForm.valid && this.isFileSelected) {
      this.isUploading = true;
      this.uploader.queue[this.uploader.queue.length - 1].upload();
      this.uploader.onSuccessItem = (
        item: FileItem,
        response: string,
        status: number,
        headers: ParsedResponseHeaders
      ) => {
        this.competitionWinner.thumbinal = JSON.parse(response).result.files.file[0];
        this.service.labelCompetitionWinner(this.competitionWinner).subscribe(
          res => {
            this.sharedService.addToast(
              "Success",
              "New Competition Winner Added!.",
              "success"
            );
            this.competitionWinner = { competitionId: "", projectId: "", city: '', thumbinal: {} }
            this.competitionWinnerForm.reset();
            this.isUploading = false;
            this.isCreateButtonClicked = false;
            this.isFileSelected = false;
          },
          err => {
            this.sharedService.addToast("Error", "Error occurred!", "error");
            this.isUploading = false;
            this.isCreateButtonClicked = false;
            this.isFileSelected = false;
          }
        );
        for (let i = 0; i < this.uploader.queue.length; i++) {
          this.uploader.queue.pop();
        }
      };
      this.uploader.onProgressItem = (
        fileItem: FileItem,
        progress: any
      ) => {
        this.progress = progress;
      };
      this.uploader.onCancelItem = (
        item: FileItem,
        response: string,
        status: number,
        headers: ParsedResponseHeaders
      ) => {
        console.log("Canceled");
        this.isUploading = false;
        this.isCreateButtonClicked = false;
        this.isFileSelected = false;
        for (let i = 0; i < this.uploader.queue.length; i++) {
          this.uploader.queue.pop();
        }
      };
      this.uploader.onErrorItem = (
        item: FileItem,
        response: string,
        status: number,
        headers: ParsedResponseHeaders
      ) => {
        console.log("error");
        this.isUploading = false;
        this.isCreateButtonClicked = false;
        this.isFileSelected = false;
        for (let i = 0; i < this.uploader.queue.length; i++) {
          this.uploader.queue.pop();
        }
      };
    } else {
      this.markFormGroupTouched(this.competitionWinnerForm);
    }
  }

  fetchParams() {
    const competitions = this.competitionService.getActiveCompetition();
    const cities = this.competitionService.getCities();
    Promise.all([competitions, cities])
      .then(res => {
        res[0].subscribe(competitionsResult => {
          this.competitions = competitionsResult.Result;
          if (this.competitions.length !== 0) {
            this.getProjects(this.competitions[0].id);
          }
        });

        res[1].subscribe(cities => {
          this.cities = cities;
        });
      });
  }


  getProjects(competitionId) {
    this.competitionService.getProjects(competitionId).subscribe(res => {
      this.projectsBackup = res.filter(project => project.solveitproject);
    });
  }

  filterProjectByCity() {
    console.log(this.competitionWinner.city);
    if (this.competitionWinner.city === '') {
      this.projects = [];
    } else {
      this.projects = this.projectsBackup.filter(project => project.cities[0] === this.competitionWinner.city);
    }
  }

  handleFileSelection($event) {
    this.isFileSelected = true;
    this.filePreviewPath = this.sanitizer.
      bypassSecurityTrustUrl((window.URL.createObjectURL(this.uploader.queue[this.uploader.queue.length - 1]._file)));
    console.log(this.filePreviewPath);
  }

  /**
   * Marks all controls in a form group as touched
   * @param formGroup - The form group to touch
   */
  public markFormGroupTouched(formGroup: any) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
