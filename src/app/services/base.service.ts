import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import Swal from 'sweetalert2';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  path: string = '';
  accpetLanguage: string = 'vi_VN';
  constructor(
    private http: HttpClient,
    private keyCloak: KeycloakService,
    private toast: ToastrService
  ) {
    this.path = environment.api_end_point;
    let language = localStorage.getItem('language');
    if (language !== null) {
      this.accpetLanguage = language;
    } else {
      this.accpetLanguage = 'vi_VN';
    }
  }

  async postData(url: string, data: any): Promise<any> {
    try {
      let response = await this.http
        .post<any>(`${this.path}/${url}`, data, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept-language': this.accpetLanguage,
          }),
          observe: 'response',
        })
        .toPromise();

      if (response?.status == 200 && response?.body) {
        if (response?.body.result.responseCode !== '00') {
          Swal.fire('Thông báo', `${response?.body.message}`, 'warning');
          return response?.body;
        } else {
          return response?.body;
        }
      } else {
        throw new Error(`${response?.body.result.message}`);
      }
    } catch (error: any) {
      console.log(error);
      if (error.error.result) {
        this.toast.error(error.error.result.message, 'Lỗi');
        // Swal.fire(`Cảnh báo`, `${error.error.result.message}`, `error`);
      } else {
        this.toast.error(error.name, 'Lỗi');

        // Swal.fire(`Cảnh báo`, `${error.name}`, `error`);
      }
      throw error;
    }
  }

  async postDataImport(url: string, data: any): Promise<any> {
    try {
      let response = await this.http
        .post<any>(`${this.path}/${url}`, data, {
          headers: new HttpHeaders({
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*',
            'Accept-language': this.accpetLanguage,
          }),
          observe: 'response',
        })
        .toPromise();
      if (response?.status == 200 && response?.body) {
        if (response?.body.result.responseCode !== '00') {
          Swal.fire('Thông báo', `${response?.body.message}`, 'warning');
          return response?.body;
        } else {
          return response?.body;
        }
      } else {
        throw new Error(`${response?.body.result.message}`);
      }
    } catch (error: any) {
      if (error.error.result) {
        this.toast.error(error.error.result.message, 'Lỗi');
      } else {
        this.toast.error(error.name, 'Lỗi');
      }
      throw error;
    }
  }

  async getData(url: string): Promise<any> {
    try {
      let response = await this.http
        .get<any>(`${this.path}/${url}`, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept-language': this.accpetLanguage,
          }),
          observe: 'response',
        })
        .toPromise();
      if (response?.status == 200 && response?.body) {
        if (response?.body.result.responseCode !== '00') {
          Swal.fire('Thông báo', `${response?.body.message}`, 'warning');
          return response?.body;
        } else {
          return response?.body;
        }
      } else {
        throw new Error(`${response?.body.result.message}`);
      }
    } catch (error: any) {
      console.log(error);
      this.toast.error(error.error.result.message);
      // Swal.fire(`Cảnh báo`, `${error.error.result.message}`, `error`);
      throw error;
    }
  }
  async deleteData(url: string): Promise<any> {
    try {
      let response = await this.http
        .delete<any>(`${this.path}/${url}`, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept-language': this.accpetLanguage,
          }),
          observe: 'response',
        })
        .toPromise();
      console.log(response);

      if (response?.status == 200 && response?.body) {
        if (response?.body.result.responseCode !== '00') {
          Swal.fire('Thông báo', `${response?.body.message}`, 'warning');
          return response?.body;
        } else {
          return response?.body;
        }
      }
    } catch (error: any) {
      console.log(error);
      this.toast.error(error.error.result.message);
      // Swal.fire(`Cảnh báo`, `${error.error.result.message}`, `error`);
      throw error;
    }
  }
  async putData(url: string, data: object): Promise<any> {
    try {
      let response = await this.http
        .put<any>(`${this.path}/${url}`, data, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept-language': this.accpetLanguage,
          }),
          observe: 'response',
        })
        .toPromise();
      if (response?.status == 200 && response?.body) {
        if (response?.body.result.responseCode !== '00') {
          Swal.fire('Thông báo', `${response?.body.message}`, 'warning');
          return response?.body;
        } else {
          return response?.body;
        }
      } else {
        throw new Error(`${response?.body.result.message}`);
      }
    } catch (error: any) {
      console.log(error);
      this.toast.error(error.error.result.message);
      // Swal.fire(`Cảnh báo`, `${error.error.result.message}`, `error`);
      throw error;
    }
  }
  async patchData(url: string, data: object): Promise<any> {
    try {
      let response = await this.http
        .patch<any>(`${this.path}/${url}`, data, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept-language': this.accpetLanguage,
          }),
          observe: 'response',
        })
        .toPromise();
      if (response?.status == 200 && response?.body) {
        if (response?.body.result.responseCode !== '00') {
          Swal.fire('Thông báo', `${response?.body.message}`, 'warning');
          return response?.body;
        } else {
          return response?.body;
        }
      } else {
        throw new Error(`${response?.body.result.message}`);
      }
    } catch (error: any) {
      console.log(error);
      this.toast.error(error.error.result.message);
      // Swal.fire(`Cảnh báo`, `${error.error.result.message}`, `error`);
      throw error;
    }
  }

  checkAuthentication(listRole: string[]) {
    if (listRole === null) {
      return true;
    }
    return listRole.some((role: string) => {
      return this.keyCloak.isUserInRole(role);
    });
  }

  isAuthorized(role: string): boolean {
    if (this.keyCloak.getUserRoles().includes(role)) {
      return true;
    }
    return false;
  }
}
