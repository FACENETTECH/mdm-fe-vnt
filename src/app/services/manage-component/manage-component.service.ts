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
  urlS3: string = environment.api_end_point_s3;
  template_url: string = environment.template_api_end_point;
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
   * Lấy ra danh sách cột theo tên bảng
   * @param tableName : Tên bảng cần lấy ra danh sách cột
   * @returns
   */
  async getColummnByTableNameOnInit(tableName: string): Promise<any> {
    return this.httpClient.get(`${this.url}/api/columns/${tableName}`, {
      headers: new HttpHeaders({
        'Accept-Language': this.accpetLanguage,
      }),
    }).toPromise();
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
   * Lấy ra danh sách các bản ghi theo bảng động
   * @param tableName : Tên bảng cần lấy ra danh sách bản ghi
   * @param request : Điều kiện tìm kiếm
   * @returns
   */
  async getDataDynamicTableOnInit(tableName: string, request: any): Promise<any> {
    return this.httpClient.post(`${this.url}/api/dynamic-tables/${tableName}/search`, request, {
      headers: new HttpHeaders({
        'Accept-Language': this.accpetLanguage,
      }),
    }).toPromise();
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

  /**
   * API upload biểu mẫu
   * @param id bản ghi cần upload biểu mẫu
   * @param form file biểu mẫu
   * @returns
   */
  uploadFileTemplate(id: number, form: any): Observable<any> {
    return this.httpClient.post(`${this.url}/api/template-form/template_form/${id}`, form, {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*'
      })
    })
  }

  /**
   * API lấy ra file biểu mẫu
   * @param id bản ghi cần lấy ra biểu mẫu
   * @returns
   */
  getFileTemplate(id: number): Observable<any> {
    return this.httpClient.get(`${this.url}/api/template-form/template_form/${id}/url`)
  }

  /**
   * API upload biểu mẫu
   * @param form file biểu mẫu
   * @returns
   */
  uploadTemplate(form: any): Observable<any> {
    return this.httpClient.post(`${this.template_url}template/`, form,{
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*'
      })
    })
  }

  /**
   * Hàm lấy ra url template
   * @param file_id
   * @returns
   */
  getTemplateUrl(file_id: string): string {
    return `${this.template_url}template/${file_id}`;
  }

  /**
   * API lấy ra thông tin bản ghi bên MDM
   * @param request
   */
  getInforRecordByCode(tableCode: string, code: string): Observable<any> {
    return this.httpClient.get(
      `${this.url}/api/dynamic-tables/${tableCode}/code/${code}`
    );
  }

  /**
   * API tạo phiếu sản xuất
   * @param fileId
   * @param request
   * @returns
   */
  generateTemplateByFileId(fileId: string, request: any) {
    return this.httpClient.post(
      `${this.template_url}render/${fileId}`,
      request,
      {
        responseType: 'blob',
      }
    );
  }

  /**
   * API upload icon
   * @param form file icon
   * @returns
   */
  uploadIcon(form: any): Observable<any> {
    return this.httpClient.post(`${this.urlS3}api/storage/uploadFile/mdm/category/icons/url`, form, {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*'
      })
    })
  }

  /**
   * API tải xuống file mẫu để người dùng chỉnh sửa và inport lại vào hệ thống
   * @param tableCode mã bảng cần import excel
   * @returns
   */
  downloadTemplateFileToImport(tableCode: string): Observable<any> {
    return this.httpClient.get(
      `${this.url}/api/excel/${tableCode}/export-to-import`, {
        responseType: 'blob',
      }
    );
  }

  /**
   * API tải xuống file mẫu để người dùng chỉnh sửa và inport lại vào hệ thống
   * @param tableCode mã bảng cần import excel
   * @returns
   */
  downloadTemplateBOMFileToImport(): Observable<any> {
    return this.httpClient.get(
      `${this.url}/api/bom/export-to-import`, {
        responseType: 'blob',
      }
    );
  }

  /**
   * API import file excel trong bảng
   * @param tableCode bảng cần import excel
   * @param request file excel
   * @returns
   */
  importFormExcel(tableCode: string, request: any) {
    return this.httpClient.post(
      `${this.url}/api/excel/${tableCode}/import-from-excel`,
      request
    );
  }

  /**
   * API import file excel trong bảng BOM
   * @param tableCode bảng cần import excel
   * @param request file excel
   * @returns
   */
  importFormExcelBOMFile(request: any) {
    return this.httpClient.post(
      `${this.url}/api/bom/import-from-excel`,
      request
    );
  }

  /**
   * API thêm mới hoặc cập nhật thông tin BOM
   * @param request thông tin BOM
   * @returns
   */
  createOrUpdateBom(request: any): Observable<any> {
    return this.httpClient.post(
      `${this.url}/api/bom/add-bom`,
      request
    );
  }

  /**
   * API cập nhật thông tin BOM
   * @param request thông tin BOM
   * @returns 
   */
  updateInforBom(request: any): Observable<any> {
    return this.httpClient.post(
      `${this.url}/api/bom/update-bom`,
      request
    );
  }

  /**
   * API thêm mới hoặc cập nhật thông tin chi tiết BOM
   * @param request thông tin BOM chi tiết
   * @returns
   */
  createOrUpdateBomDetail(request: any): Observable<any> {
    return this.httpClient.post(
      `${this.url}/api/bom/add-bomdetail`,
      request
    );
  }

  /**
   * API lấy ra danh sách BOM
   * @param request thông tin search BOM
   * @returns
   */
  getAllBom(request: any): Observable<any> {
    return this.httpClient.post(
      `${this.url}/api/bom/get-all-bom`,
      request
    );
  }

  /**
   * API lấy ra danh sách BOM chi tiết
   * @param request thông tin search BOM chi tiết
   * @returns
   */
  getAllBomDetail(request: any): Observable<any> {
    return this.httpClient.post(
      `${this.url}/api/bom/get-all-bomdetail`,
      request
    );
  }

  /**
   * API lấy ra danh sách BOM chi tiết
   * @param request thông tin search BOM chi tiết
   * @returns
   */
  getAllBomDetailInView(request: any): Observable<any> {
    return this.httpClient.post(
      `${this.url}/api/bom/get-all-bomdetail-view`,
      request
    );
  }

  /**
   * API lấy ra thông tin bom BOM chi tiết theo ID
   * @param request id Bom cần lấy ra thông tin
   * @returns
   */
  getInforBom(request: any): Observable<any> {
    return this.httpClient.post(
      `${this.url}/api/bom/get-bom-info`,
      request
    );
  }

  /**
   * API xoá thông tin Bom và Bom detail
   * @param request
   * @returns
   */
  deleteBomAndBomDetail(request: any): Observable<any> {
    return this.httpClient.post(
      `${this.url}/api/bom/delete-bom`,
      request
    );
  }


  /**
   * Cập nhật thông tin bản ghi trong table đang truy cập
   * @param tableName Tên bảng cần cập nhật bản ghi
   * @param id id bản ghi cần cập nhật
   * @param request Thông tin các bản ghi cần cập nhật
   * @returns
   */
  updateListInforRecordByIdV2(
    tableName: string,
    request: any
  ): Observable<any> {
    return this.httpClient.put(
      `${this.url}/api/dynamic-tables/${tableName}/batch-v2`,
      request,
      {
        headers: new HttpHeaders({
          'Accept-Language': this.accpetLanguage,
        }),
      }
    );
  }
}
