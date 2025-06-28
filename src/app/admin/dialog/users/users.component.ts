import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit{
  onAddUser = new EventEmitter();
  onEditUser = new EventEmitter();
  userForm: any = FormGroup;
  dialogAction = "Add";
  action: any = "Add";
 
  responseMessage: any;
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<UsersComponent>,
    private snackbar: SnackbarService,
    public themeService: ThemeService,
    private userService: UserService,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      name: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });

    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Update",
      this.userForm.patchValue(this.dialogData.data);
      this.userForm.controls['password'].setValue('password');
    } 
  }

  //handle submit
  handleSubmit() {
    if (this.dialogAction == "Edit") {
      this.edit()
    } else {
      this.add();
    }
  }

  //handle add user
  add() {
    this.ngxService.start();
    var formData = this.userForm.value;
    var data = {
      email: formData.email,
      name: formData.name,
      password: formData.password
    }
    this.userService.addUser(data).subscribe(
      (response: any)=>{
        this.ngxService.stop();
        this.dialogRef.close();
        this.onAddUser.emit();
        this.responseMessage = response.message;
        this.snackbar.openSnackBar(this.responseMessage);
      },
      (error: any)=>{
        this.ngxService.stop();
        console.log(error);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericerror;
        }
        this.snackbar.openSnackBar(this.responseMessage);
      }
    );
  }

  //handle edit user
  edit() {
    this.ngxService.start();
    var formData = this.userForm.value;
    var data = {
      email: formData.email,
      name: formData.name,
      id: this.dialogData.data.id
    }
    this.userService.updateUser(data).subscribe(
      (response: any)=>{
        this.ngxService.stop();
        this.dialogRef.close();
        this.onEditUser.emit();
        this.responseMessage = response.message;
        this.snackbar.openSnackBar(this.responseMessage);
      },
      (error: any)=>{
        this.ngxService.stop();
        console.log(error);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericerror;
        }
        this.snackbar.openSnackBar(this.responseMessage);
      }
    );
  }
}
