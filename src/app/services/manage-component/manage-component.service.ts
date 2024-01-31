import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageComponentService {
  url: string = environment.api_end_point;
  constructor(private baseService: BaseService, private httpClient: HttpClient,) {}

  /**
   * Lấy ra thông tin các bảng con trong chức năng
   * @param tableName: Trường name trong object thông tin bảng
   */
  getInforTables(tableName: any): Observable<any> {
    return this.httpClient.get(`${this.url}/api/categories/${tableName}`)
  }

  /**
   * Lấy ra danh sách param theo tên column
   * @param param : Tên của column cần lấy ra param
   * @returns 
   */
  getParamsByCode(param: any): Observable<any> {
    return this.httpClient.get(`${this.url}/api/params/units/${param}`)
  }

  /**
   * Lấy ra danh sách param theo tên bảng và tên column
   * @param tableName : Tên bảng cần lấy ra danh sách param
   * @param columnName : Tên cột cần lấy ra danh sách param
   * @returns 
   */
  getParamByTableNameAndColumnName(tableName: string, columnName: string): Observable<any> {
    return this.httpClient.get(`${this.url}/api/params/columns/${tableName}/${columnName}`);
  }

  /**
   * Lấy ra danh sách cột theo tên bảng
   * @param tableName : Tên bảng cần lấy ra danh sách cột
   * @returns 
   */
  getColummnByTableName(tableName: string): Observable<any> {
    return this.httpClient.get(`${this.url}/api/columns/${tableName}`);
  }

  /**
   * Lấy ra danh sách các bản ghi theo bảng động
   * @param tableName : Tên bảng cần lấy ra danh sách bản ghi
   * @param request : Điều kiện tìm kiếm
   * @returns 
   */
  getDataDynamicTable(tableName: string, request: any): Observable<any> {
    return this.httpClient.post(`${this.url}/api/dynamic-tables/${tableName}/search`, request);
  }

  /**
   * Thêm mới 1 bản ghi vào trong table đang truy cập
   * @param tableName Tên bảng cần thêm mới bản ghi
   * @param request Thông tin bản ghi cần thêm mới
   * @returns 
   */
  addNewRecord(tableName: string, request: any): Observable<any> {
    return this.httpClient.post(`${this.url}/api/dynamic-tables/${tableName}`, request);
  }

  /**
   * Thêm mới nhiều bản ghi vào trong table đang truy cập
   * @param tableName Tên bảng cần thêm mới bản ghi
   * @param request Thông tin các bản ghi cần thêm mới
   * @returns 
   */
  addListRecord(tableName: string, request: any): Observable<any> {
    return this.httpClient.post(`${this.url}/api/dynamic-tables/${tableName}/batch`, request);
  }

  /**
   * Cập nhật thông tin bản ghi trong table đang truy cập
   * @param tableName Tên bảng cần cập nhật bản ghi
   * @param id id bản ghi cần cập nhật
   * @param request Thông tin các bản ghi cần cập nhật
   * @returns 
   */
  updateInforRecordById(tableName: string, id: any, request: any): Observable<any> {
    return this.httpClient.put(`${this.url}/api/dynamic-tables/${tableName}/${id}`, request);
  }

  /**
   * Xoá thông tin bản ghi trong table bằng id
   * @param tableName Tên bảng cần xoá bản ghi
   * @param id id bản ghi cần xoá
   * @returns 
   */
  deleteRecordById(tableName: string, id: any): Observable<any> {
    return this.httpClient.delete(`${this.url}/api/dynamic-tables/${tableName}/${id}`);
  }

  /**
   * Xoá thông tin các bản ghi trong table bằng id
   * @param tableName Tên bảng cần xoá bản ghi
   * @param listId Danh sách id bản ghi cần xoá
   * @returns 
   */
  deleteListRecordByListId(tableName: string, listId: any): Observable<any> {
    return this.httpClient.put(`${this.url}/api/dynamic-tables/${tableName}/delete-batch`, listId);
  }
}
