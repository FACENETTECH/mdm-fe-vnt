import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageComponentService {
  url: string = environment.api_end_point;
  accpetLanguage: string = 'vi_VN';
  constructor(private baseService: BaseService, private httpClient: HttpClient,) {
    let language = localStorage.getItem('language');
    if (language !== null) {
      this.accpetLanguage = language;
    } else {
      this.accpetLanguage = 'vi_VN';
    }
  }

  /**
   * Lấy ra thông tin các bảng con trong chức năng
   * @param tableName: Trường name trong object thông tin bảng
   */
  getInforTables(tableName: any): Observable<any> {
    return this.httpClient.get(`${this.url}/api/categories/${tableName}`, {
      headers: new HttpHeaders({
        'Accept-Language': this.accpetLanguage,
      }),
    })
  }

  /**
   * Lấy ra danh sách param theo tên column
   * @param param : Tên của column cần lấy ra param
   * @returns 
   */
  getParamsByCode(param: any): Observable<any> {
    return this.httpClient.get(`${this.url}/api/params/units/${param}`, {
      headers: new HttpHeaders({
        'Accept-Language': this.accpetLanguage,
      }),
    })
  }

  /**
   * Lấy ra danh sách param theo tên bảng và tên column
   * @param tableName : Tên bảng cần lấy ra danh sách param
   * @param columnName : Tên cột cần lấy ra danh sách param
   * @returns 
   */
  getParamByTableNameAndColumnName(tableName: string, columnName: string): Observable<any> {
    return this.httpClient.get(`${this.url}/api/params/columns/${tableName}/${columnName}`, {
      headers: new HttpHeaders({
        'Accept-Language': this.accpetLanguage,
      }),
    });
  }

  /**
   * Lấy ra danh sách cột theo tên bảng
   * @param tableName : Tên bảng cần lấy ra danh sách cột
   * @returns 
   */
  getColummnByTableName(tableName: string): Observable<any> {
    return this.httpClient.get(`${this.url}/api/columns/${tableName}`, {
      headers: new HttpHeaders({
        'Accept-Language': this.accpetLanguage,
      }),
    });
  }

  /**
   * Lấy ra danh sách các bản ghi theo bảng động
   * @param tableName : Tên bảng cần lấy ra danh sách bản ghi
   * @param request : Điều kiện tìm kiếm
   * @returns 
   */
  getDataDynamicTable(tableName: string, request: any): Observable<any> {
    return this.httpClient.post(`${this.url}/api/dynamic-tables/${tableName}/search`, request, {
      headers: new HttpHeaders({
        'Accept-Language': this.accpetLanguage,
      }),
    });
  }

  /**
   * Thêm mới 1 bản ghi vào trong table đang truy cập
   * @param tableName Tên bảng cần thêm mới bản ghi
   * @param request Thông tin bản ghi cần thêm mới
   * @returns 
   */
  addNewRecord(tableName: string, request: any): Observable<any> {
    return this.httpClient.post(`${this.url}/api/dynamic-tables/${tableName}`, request, {
      headers: new HttpHeaders({
        'Accept-Language': this.accpetLanguage,
      }),
    });
  }

  /**
   * Thêm mới nhiều bản ghi vào trong table đang truy cập
   * @param tableName Tên bảng cần thêm mới bản ghi
   * @param request Thông tin các bản ghi cần thêm mới
   * @returns 
   */
  addListRecord(tableName: string, request: any): Observable<any> {
    return this.httpClient.post(`${this.url}/api/dynamic-tables/${tableName}/batch`, request, {
      headers: new HttpHeaders({
        'Accept-Language': this.accpetLanguage,
      }),
    });
  }

  /**
   * Cập nhật thông tin bản ghi trong table đang truy cập
   * @param tableName Tên bảng cần cập nhật bản ghi
   * @param id id bản ghi cần cập nhật
   * @param request Thông tin các bản ghi cần cập nhật
   * @returns 
   */
  updateInforRecordById(tableName: string, id: any, request: any): Observable<any> {
    return this.httpClient.put(`${this.url}/api/dynamic-tables/${tableName}/${id}`, request, {
      headers: new HttpHeaders({
        'Accept-Language': this.accpetLanguage,
      }),
    });
  }

  /**
   * Xoá thông tin bản ghi trong table bằng id
   * @param tableName Tên bảng cần xoá bản ghi
   * @param id id bản ghi cần xoá
   * @returns 
   */
  deleteRecordById(tableName: string, id: any): Observable<any> {
    return this.httpClient.delete(`${this.url}/api/dynamic-tables/${tableName}/${id}`, {
      headers: new HttpHeaders({
        'Accept-Language': this.accpetLanguage,
      }),
    });
  }

  /**
   * Xoá thông tin các bản ghi trong table bằng id
   * @param tableName Tên bảng cần xoá bản ghi
   * @param listId Danh sách id bản ghi cần xoá
   * @returns 
   */
  deleteListRecordByListId(tableName: string, listId: any): Observable<any> {
    return this.httpClient.put(`${this.url}/api/dynamic-tables/${tableName}/delete-batch`, listId, {
      headers: new HttpHeaders({
        'Accept-Language': this.accpetLanguage,
      }),
    });
  }

  /**
   * API thêm mới ảnh trong chức năng có column dataType là image
   * @param tableName Tên bảng cần lưu ảnh
   * @param columnName Tên cột cần lưu ảnh
   * @param id id của bản ghi cần lưu ảnh
   * @param request File ảnh cần lưu
   * @returns 
   */
  uploadImageInComponents(tableName: any, id: any ,request: any): Observable<any> {
    return this.httpClient.post(`${this.url}/api/system-storage/${tableName}/${id}`, request, {
      headers: new HttpHeaders({
        'Accept-Language': this.accpetLanguage,
      }),
    });
  }

  /**
   * API lấy ra ảnh trong chức năng có column dataType là image
   * @param tableName Tên bảng cần cần lấy ảnh ra
   * @param columnName Tên cột cần lấy ảnh ra
   * @param id id của bản ghi cần lấy ảnh ra
   * @param fileName Tên file ảnh cần lấy ra
   * @returns 
   */
  getImageInComponents(tableName: any, id: any): Observable<any> {
    return this.httpClient.get(`${this.url}/api/system-storage/${tableName}/${id}`, {
      headers: new HttpHeaders({
        'Accept-Language': this.accpetLanguage,
      }),
    });
  }

  /**
   * API thêm mới giá trị trong bảng param
   * @param request 
   * @returns 
   */
  addValuesParam(request: any): Observable<any> {
    return this.httpClient.post(`${this.url}/api/params`, request, {
      headers: new HttpHeaders({
        'Accept-Language': this.accpetLanguage,
      }),
    });
  }

  /**
   * API cập nhật thông tin giá trị trong bảng param
   * @param request 
   * @returns 
   */
  updateValuesParam(request: any): Observable<any> {
    return this.httpClient.put(`${this.url}/api/params`, request, {
      headers: new HttpHeaders({
        'Accept-Language': this.accpetLanguage,
      }),
    });
  }

  /**
   * Xoá thông tin bản ghi param bằng id
   * @param id id bản ghi param cần xoá
   * @returns 
   */
   deleteValueParamById(id: any): Observable<any> {
    return this.httpClient.delete(`${this.url}/api/params/${id}`, {
      headers: new HttpHeaders({
        'Accept-Language': this.accpetLanguage,
      }),
    });
  }

  /**
   * API lấy ra 10 giá trị auto complete khi nhập vào common search
   * @param tableName tên danh mục
   * @param value giá trị đã được nhập
   * @returns 1 set 10 giá trị auto complete
   */
  getCommonAutoComplete(tableName: string, value: string): Observable<any> {
    const params = new HttpParams().set('value', value);
    return this.httpClient.get(`${this.url}/api/dynamic-tables/${tableName}/auto-complete`, { params });
  }

  /**
   * API lấy ra thông tin bản ghi theo id và mã bảng truyền vào
   * @param tableCode mã bảng cần lấy bản ghi
   * @param id id của bản ghi cần lấy
   * @returns 
   */
  getInforRecordById(tableCode: any, id: any): Observable<any> {
    return this.httpClient.get(`${this.url}/api/dynamic-tables/${tableCode}/${id}`, {
      headers: new HttpHeaders({
        'Accept-Language': this.accpetLanguage,
      }),
    });
  }
}
