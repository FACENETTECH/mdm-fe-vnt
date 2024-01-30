import { Injectable } from '@angular/core';
import { BaseService } from '../../base.service';

// const api_url = 'api/machines';

@Injectable({
  providedIn: 'root',
})
export class InfoMachineService {
  constructor(private baseService: BaseService) {}
  api_url = 'api/machines';
  // Hàm xử lý chức năng gọi API lấy danh sách máy
  async getMachine(request: any) {
    let res = await this.baseService.postData(`${this.api_url}`, request);

    return res;
  }
  api_url_type = 'api/machine-types';

  async getMachineTypeList(request: any) {
    let res = await this.baseService.getData(`${this.api_url_type}`);
    console.log(res);

    return res;
  }
  async addTypeList(request: any) {
    let res = await this.baseService.postData(`${this.api_url_type}`, request);
    console.log(res);

    return res;
  }

  async serachCommon(requets: any) {
    return await this.baseService.postData(
      `api/machines/common-autocomplete`,
      requets
    );
  }

  // Hàm xử lý chức năng gọi API thêm máy
  async addMachine(request: any) {
    let res = await this.baseService.postData(`${this.api_url}/new`, request);

    return res;
  }

  // Hàm xử lý chức năng gọi API cập nhật máy
  async updateMachine(request: any, machineCode: string) {
    let res = await this.baseService.putData(
      `api/machines/${machineCode}`,
      request
    );
    return res;
  }

  // Hàm xử lý chức năng gọi API xóa máy
  async deleteMachine(machineCode: string) {
    let res = await this.baseService.deleteData(`api/machines/${machineCode}`);
    return res;
  }
  async importMachine(file: any) {
    let res = await this.baseService.postDataImport(
      `api/machines/import-excel`,
      file
    );
    return res;
  }
}
