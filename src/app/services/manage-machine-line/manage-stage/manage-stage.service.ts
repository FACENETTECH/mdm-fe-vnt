import { Injectable } from '@angular/core';
import { BaseService } from '../../base.service';

@Injectable({
  providedIn: 'root'
})
export class ManageStageService {

  api_url = 'api/stages'

constructor(
  private baseService: BaseService,
) {}

/**Hàm gọi API lấy danh sách công đoạn */
async getStage(request: any){
  let res = await this.baseService.postData(`${this.api_url}`, request);

  return res;
}

/**API search common autocomplete */
async searchCommonAutocomplete(request: any){
  return await this.baseService.postData(`api/stages/auto-complete-common`, request);
}

/**Hàm gọi API thêm mới công đoạn */
async addStage(request: any){
  let res = await this.baseService.postData(`${this.api_url}/new`, request);

  return res;
}

/**Hàm gọi API cập nhật công đoạn */
async updateStage(request: any, stageCode: string){
  let res = await this.baseService.putData(`api/stages/${stageCode}`,request);
  return res;
}

/**Hàm gọi api xóa công đoạn */
async deleteStage(stageCode: string){
  let res = await this.baseService.deleteData(`api/stages/${stageCode}`);
  return res;
}

/**Hàm gọi import công đoạn từ file excel */
async importStage(file: any){
  let res = await this.baseService.postDataImport(`api/stages/import-stage`, file);
  return res;
}


/**Hàm gọi API lấy danh sách job */
async getJob(request: any){
  let res = await this.baseService.postData('api/jobs', request);

  return res;
}

/**Hàm gọi API thêm mới/cập nhật job */
async updateJob(request: any){
  let res = await this.baseService.postData('api/jobs/new-job', request);
  return res;
} 

async editJob(request: any, jobCode: string){
  return await this.baseService.putData(`api/jobs/${jobCode}`, request)
}

/**Hàm gọi API xóa job */
async deleteJob(jobCode: string){
  console.log(`api/jobs/${jobCode}`);
  
  let res = await this.baseService.deleteData(`api/jobs/${jobCode}`);
  return res;
}


}
