import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  //Add new category 
  addCategory(data: any) {
    return this.httpClient.post(this.url + "/category/AddNewCategory", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  //update category
  updateCategory(data: any) {
    return this.httpClient.post(this.url + "/category/updateCategory", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  //get categories
  getAllCategory() {
    return this.httpClient.get(this.url + "/category/getAllCategory");
  }

}
