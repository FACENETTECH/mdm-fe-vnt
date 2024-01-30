import { Injectable } from '@angular/core';
import { BaseService } from '../../base.service';
import { HttpClient } from '@angular/common/http';

// const api_url = `api/production-line`;

@Injectable({
  providedIn: 'root'
})
export class InfoLineService {
  api_url = `api/production-line`;
  api_url_type = `api/production-line-types`
  constructor(
    private baseService: BaseService,
    private Http:HttpClient
  ) { }
  // Hàm xử lý chức năng gọi API lấy danh sách dây chuyền
  async getLine(request: any){
    let res = await this.baseService.postData(`${this.api_url}`, request);

    return res;
  }
  async deleteLine(productionLineCode: string){
    let res = await this.baseService.deleteData(`api/production-line/${productionLineCode}`);
    return res;
  }
  async updateLine(request: any, productionLineCode: string){
    let res = await this.baseService.putData(`api/production-line/${productionLineCode}`,request);
    return res;
  }
  async addLine(request: any){
    let res = await this.baseService.postData(`${this.api_url}/new`, request);

    return res;
  }
  async getLineTypeList(request: any) {
    let res = await this.baseService.getData(`${this.api_url_type}`);
    console.log(res);

    return res;
  }
  async addTypeList(request: any) {
    let res = await this.baseService.postData(`${this.api_url_type}`,request);
    console.log(res);

    return res;
  }

  async searchCommonAutocomplete(request: any){
    return await this.baseService.postData(`api/production-line/auto-complete`, request);

  }


}
