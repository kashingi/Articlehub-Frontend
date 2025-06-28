import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  login(data: any) {
    return this.httpClient.post(this.url + "/appuser/login", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //ad new user
  addUser(data: any) {
    return this.httpClient.post(this.url + "/appuser/addNewAppuser", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //method to get all app users
  getAllAppusers() {
    return this.httpClient.get(this.url + "/appuser/getAllAppuser");
  }

  //update up user
  updateUser(data: any) {
    return this.httpClient.post(this.url + "/appuser/updateUser", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }
  //update up user status
  updateUserStatus(data: any) {
    return this.httpClient.post(this.url + "/appuser/updateUserStatus", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }
}
