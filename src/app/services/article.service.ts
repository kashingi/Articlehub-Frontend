import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  url = environment.apiUrl;  
  constructor(private httpClient: HttpClient) { }

  //add new article into the database
  addNewArticle(data: any){
    return this.httpClient.post(this.url + "/article/addNewArticle", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //update article int o the database
  updateArticle(data: any){
    return this.httpClient.post(this.url + "/article/updateArticle", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }
  //get All articles
  getArticle() {
    return this.httpClient.get(this.url + "/article/getAllArticle")
  }

  //get All published articles
  getPublishedArticle() {
    return this.httpClient.get(this.url + "/article/getAllPublishedArticle")
  }

  //delete article
  deleteArticle(articleId: any) {
    return this.httpClient.get(this.url + "/article/deleteArticle/" + articleId)
  }
}
