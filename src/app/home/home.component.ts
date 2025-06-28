import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { ArticleService } from '../services/article.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';
import { ArticleDetailsComponent } from '../article-details/article-details.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  responseMessage: any;
  articles: any;
  searchText: string = '';

  constructor(
    public themeService: ThemeService,
    private articleService: ArticleService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
    private router: Router,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.tableData()
  }

  //table data here
  tableData() {
    this.ngxService.start();
    this.articleService.getPublishedArticle().subscribe(
      (response: any)=>{
        console.log(response);
        this.articles = response.entity;
        this.ngxService.stop();
      },
      (error: any)=>{
        console.log(error);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericerror
        }
        this.snackbar.openSnackBar(this.responseMessage)
      }
    );
  }

  //Change theme color
  changeTheme(color: any) {
    this.themeService.setTheme(color);
  }

  //filter here
  // filteredItems(): any {
  //   return this.articles.filter(item =>
  //     item.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
  //     item.categoryName.toLowerCase().includes(this.searchText.toLowerCase())
  //   );
  // }

  filteredItems(): any[] {
    if (!this.articles) {
      return []; // Return an empty array if articles are not loaded
    }
    return this.articles.filter(item =>
      item?.title?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      item?.categoryName?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
  

  //Handle view Action
  handleViewAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values
    };
    dialogConfig.width = "540px";
    const dialogref = this.dialog.open(ArticleDetailsComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogref.close();
    })
  }
}

