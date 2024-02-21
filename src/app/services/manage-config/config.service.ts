import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  url: string = environment.api_end_point;
  accpetLanguage: string = 'vi_VN';
  constructor(
    private baseService: BaseService,
    private httpClient: HttpClient
  ) {
    let language = localStorage.getItem('language');
    if (language !== null) {
      this.accpetLanguage = language;
    } else {
      this.accpetLanguage = 'vi_VN';
    }
  }

  /** API to get Column */
  async getColumn(entityType: number){
    return await this.baseService.getData(`api/column-properties/${entityType}`);
  }


  /**API for search column */
  async searchColumn(request: any){
    return await this.baseService.postData(`api/column-properties/search`, request)
  }

  /**API for autocomplete common */
  async autoComplete(request: any){
    return await this.baseService.postData(`api/column-properties/common-autocomplete`, request)
  }

  /**API to create column */
  async createColumn(request: any){
    return await this.baseService.postData(`api/column-properties`, request);
  }

  /**API to update column */
  async updateColumn(keyName: string, request: any){
    return await this.baseService.putData(`api/column-properties/${keyName}`, request);
  }

  /**API to delete column */
  async deleteColumn(keyName: string, entityType: number){
    return await this.baseService.deleteData(`api/column-properties/${keyName}/${entityType}`);
  }

  /**
   * API lấy ra danh sách chức năng
   */
  getAllCategory(): Observable<any> {
    return this.httpClient.get(`${this.url}/api/categories`, {
      headers: new HttpHeaders({
        'Accept-Language': this.accpetLanguage,
      }),
    });
  }

  /**
   * API lấy ra chức năng theo Name
   */
  getCategoryByName(tableName: any): Observable<any> {
    return this.httpClient.get(`${this.url}/api/categories/${tableName}`, {
      headers: new HttpHeaders({
        'Accept-Language': this.accpetLanguage,
      }),
    });
  }

  /**
   * API thêm mới chức năng
   */
  addNewCategory(request: any) {
    return this.httpClient.post(`${this.url}/api/categories`, request, {
      headers: new HttpHeaders({
        'Accept-Language': this.accpetLanguage,
      }),
    });
  }

  /**
   * API xoá bảng trong chức năng bảng động
   * @param tableName Tên bảng cần xoá
   * @returns 
   */
  deleteCategory(tableName: any): Observable<any> {
    return this.httpClient.delete(`${this.url}/api/categories/${tableName}`, {
      headers: new HttpHeaders({
        'Accept-Language': this.accpetLanguage,
      }),
    });
  }

  /**
   * API cập nhật thông tin bảng
   * @param tableName Tên bảng cần xoá
   * @param request Các thông tin cần cập nhật
   * @returns 
   */
  updateInforTable(tableName: any, request: any): Observable<any> {
    return this.httpClient.put(`${this.url}/api/categories/${tableName}`, request, {
      headers: new HttpHeaders({
        'Accept-Language': this.accpetLanguage,
      }),
    });
  }

  /**
   * Đây là hàm lấy ra danh sách chức năng của từng phân hệ
   */
   getAllFunction(): Observable<any> {
    return this.httpClient.get(`${this.url}/api/categories`)
  }
}
