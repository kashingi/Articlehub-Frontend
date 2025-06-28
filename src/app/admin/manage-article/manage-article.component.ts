import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ArticleService } from 'src/app/services/article.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ThemeService } from 'src/app/services/theme.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { ArticleComponent } from '../dialog/article/article.component';
import { ViewArticleComponent } from '../dialog/view-article/view-article.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-manage-article',
  templateUrl: './manage-article.component.html',
  styleUrls: ['./manage-article.component.scss']
})
export class ManageArticleComponent implements OnInit {
  displayedColumns: string[] = ['Id', 'title', 'categoryName', 'status', 'publication_date', 'edit'];
  dataSource: any;
  responseMessage: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private router: Router,
    public themeService: ThemeService,
    private articleService: ArticleService,
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  //get table data here
  tableData() {
    this.articleService.getArticle().subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(response.entity);
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
    const dialogRef = this.dialog.open(ArticleComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const res = dialogRef.componentInstance.onAddArticle.subscribe(
      (response: any)=>{
        this.tableData();
      }
    );
  }

  // handle view action here
  handleViewAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'View',
      data: values
    };
    dialogConfig.width = "540px";
    const dialogRef = this.dialog.open(ViewArticleComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
  }

  //handle view action here
  handleEditAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values
    };
    dialogConfig.width = "540px";
    const dialogRef = this.dialog.open(ArticleComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const res = dialogRef.componentInstance.onEditArticle.subscribe(
      (response: any)=>{
        this.tableData();
      }
    );
  }

  // handle on delete here
  onDelete(value: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete ' + value.title + 'article'
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const res = dialogRef.componentInstance.onEmitStatusChange.subscribe((response: any) => {
      this.ngxService.start();
      this.deleteProduct(value.id);
      dialogRef.close();
    })
  }

  //handle delete action here
  deleteProduct(articleId: any) {
    this.articleService.deleteArticle(articleId).subscribe(
      (response: any) => {
        this.ngxService.start();
        this.tableData();
        this.responseMessage = response.message;
        this.snackbar.openSnackBar(this.responseMessage);
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
}
