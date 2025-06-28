import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { UsersComponent } from '../dialog/users/users.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'email', 'status', 'edit'];
  dataSource: any;
  responseMessage: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private router: Router,
    private userService: UserService,
    public themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    this.userService.getAllAppusers().subscribe(
      (response: any) => {
        console.log(response)
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
      },
      (error: any) => {
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

  //handle add action here
  handleAddAction() { 
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add'
    };
    dialogConfig.width = "540px";
    const dialogRef = this.dialog.open(UsersComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const res = dialogRef.componentInstance.onAddUser.subscribe(
      (response)=>{
        this.tableData();
      }
    );
  }

  //handle edit action here
  handleEditAction(values: any) { 
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values
    };
    dialogConfig.width = "540px";
    const dialogRef = this.dialog.open(UsersComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const res = dialogRef.componentInstance.onEditUser.subscribe(
      (response)=>{
        this.tableData();
      }
    );
  }

  //handle change status here
  onChange(status: any, id: any) {
    var data = {
      id: id,
      status: status.toString()
    }
    this.userService.updateUserStatus(data).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.responseMessage = response?.message;
        this.snackbar.openSnackBar(this.responseMessage);
        this.tableData();
      },
      (error: any) => {
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
  //apply filter here
  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
}
