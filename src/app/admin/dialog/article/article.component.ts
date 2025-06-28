import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ArticleService } from 'src/app/services/article.service';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ThemeService } from 'src/app/services/theme.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  onAddArticle = new EventEmitter();
  onEditArticle = new EventEmitter();
  articleForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Add";
  categorys: any;
  responseMessage: any;

  statuses = [
    { name: 'Draft' },
    { name: 'Published' }
  ]


  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<ArticleComponent>,
    private snackbar: SnackbarService,
    public themeService: ThemeService,
    private articleService: ArticleService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.articleForm = this.formBuilder.group({
      title: [null, [Validators.required]],
      content: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
      status: [null, Validators.required]
    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Update";
      this.articleForm.patchValue(this.dialogData.data);
    }

    this.getCategory();

  }

  //get all categories here
  getCategory() {
    setTimeout(() => this.ngxService.start()); // Delayed execution
    this.categoryService.getAllCategory().subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.categorys = response.entity;
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

  //handle submit here
  handleSubmit() {
    if (this.dialogAction === "Edit") {
      this.edit();
    } else {
      this.add();
    }
  }

  //implement add method here
  add() {
    this.ngxService.start();
    var formData = this.articleForm.value;
    var data = {
      title: formData.title,
      content: formData.content,
      categoryId: formData.categoryId,
      status: formData.status
    }
    this.articleService.addNewArticle(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.ngxService.stop();
        this.onAddArticle.emit();
        this.responseMessage = response.message;
        this.snackbar.openSnackBar(this.responseMessage);
      },
      (error: any) => {
        this.dialogRef.close();
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

  //implement edit method here
  edit() {
    this.ngxService.start();
    var formData = this.articleForm.value;
    var data = {
      id: this.dialogData.data.id,
      title: formData.title,
      content: formData.content,
      categoryId: formData.categoryId,
      status: formData.status
    }
    this.articleService.updateArticle(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.ngxService.stop();
        this.onEditArticle.emit();
        this.responseMessage = response.message;
        this.snackbar.openSnackBar(this.responseMessage);
      },
      (error: any) => {
        this.dialogRef.close();
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
