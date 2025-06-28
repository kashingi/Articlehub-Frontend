import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ThemeService } from 'src/app/services/theme.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { CategoryComponent } from '../dialog/category/category.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit{

  displayedColumns: string[] =['Id', 'name', 'edit'];
  dataSource: any;
  responseMessage: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    private categoryService: CategoryService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private router: Router,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    this.categoryService.getAllCategory().subscribe(
      (response: any)=>{
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(response.entity);
        this.dataSource.paginator = this.paginator;
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

  //handle add action here
  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add'
    };
    dialogConfig.width = "540px";
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });

    const res = dialogRef.componentInstance.onAddCategory.subscribe(
      (response: any)=>{
        this.tableData();
      }
    )
  }

  // handle edit action here
  handleEditAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values
    };
    dialogConfig.width = "540px";
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });

    const res = dialogRef.componentInstance.onEditCategory.subscribe(
      (response: any)=>{
        this.tableData();
      }
    )
  }

  //apply filter here
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
}
