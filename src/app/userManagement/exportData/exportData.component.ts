import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { UserManagementService } from '../userManagament.service';
import { AuthService } from '../../Auth/services/auth.service';
import { configs } from '../../app.config';

@Component({
    selector: 'app-export-data',
    templateUrl: 'exportData.component.html',
    styleUrls: ['exportData.component.css']
})

export class ExportDataComponent implements OnInit {

    public selectionOptions = {sex: 'both', educationLevel: 'none', selectedCity: 0};
    public cities = [];
    public optionForm: FormGroup;
    public educationLevels = [
      'Elementary',
      'HighSchool',
      'University Degree',
      'Post Graduate',
      'University Dropout',
      'HighSchool Dropout',
      'Elementary Dropout',
      'Other'
    ];

    constructor(public apiService: ApiService, public service: UserManagementService, public fb: FormBuilder, public authService: AuthService) {

    }

    ngOnInit() {
        this.getCities();
        this.optionForm = this.fb.group({
            sex: [''],
            educationLevel: [''],
            city: ['']
          });
    }

    exportReport() {
      const options = {selectionOptions: this.selectionOptions};
      this.apiService.downloadExcel(`${configs.rootUrl}UserAccounts/exportData`, options).subscribe(
        res => {
          this.exportData(res);
        }
      );
  }

	exportData(data) {
        const blob = data;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'fileName.xls';
        document.body.appendChild(a);
        a.click();
    }

    getCities() {
        this.service.getCities().subscribe(
            res => {
                this.cities = res;
            }
        );
    }

}
