import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

constructor(
  private baseService: BaseService,
) { }

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



}
