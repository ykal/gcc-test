import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { AuthService } from '../../Auth/services/auth.service';
import { SharedService } from '../../shared/services/shared.service';
import { PasswordValidation } from '../../Auth/validator/passwordValidation';
import { PhoneNumberValidation } from '../../Auth/validator/phoneNumberValidation';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-user',
  templateUrl: 'addUser.component.html',
  styleUrls: ['addUser.component.css']
})
export class AddUserComponent implements OnInit {
  public user = {
    gender: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    username: '',
    phoneNumber: '',
    password: '',
    rePassword: ''
  };
  public selected = 'participant';
  public userForm: FormGroup;
  public roles = [
    { id: 'solve-it-mgt', name: 'Management Team' },
    { id: 'solve-it-team', name: 'Staff & Mentor Team' }
  ];
  public role = '';
  public isPosting = false;
  @Output() back = new EventEmitter();
  @Output() created = new EventEmitter();

  constructor(
    public service: AuthService,
    public sharedService: SharedService,
    public formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.userForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        middleName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', Validators.required, this.isEmailUnique.bind(this)],
        gender: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        role: ['', Validators.required],
        username: ['', Validators.required],
        password: ['', Validators.required],
        rePassword: ['', Validators.required]
      },
      {
        validator: Validators.compose([
          PasswordValidation.MatchPassword,
          PhoneNumberValidation.Validate
        ])
      }
    );
  }

  addUser() {
    if (this.userForm.valid) {
      this.spinner.show();
      this.isPosting = true;
      this.service.addUser(this.user, this.role).subscribe(
        res => {
          this.sharedService.addToast('Success', 'New User Added!', 'success');
          this.isPosting = false;
          this.showUsersList();
          this.spinner.hide();
        },
        err => {
          this.sharedService.addToast('', 'Error occurred!', 'error');
          this.isPosting = false;
          this.spinner.hide();
        }
      );
    } else {
      this.markFormGroupTouched(this.userForm);
    }
  }

  /**
   * Marks all controls in a form group as touched
   * @param formGroup - The form group to touch
   */
  private markFormGroupTouched(formGroup: any) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  toggleView(view) {
    this.selected = view;
  }

  showUsersList() {
    this.created.emit();
  }

  backToList() {
    this.back.emit();
  }

  isEmailUnique(control: FormControl) {
    const q = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.service.isEmailUnique(this.user.email).subscribe(
          res => {
            if (res) {
              resolve(null);
            } else {
              resolve({ isEmailUnique: true });
            }
          },
          () => {
            resolve(null);
          }
        );
      }, 1000);
    });
    return q;
  }
}
