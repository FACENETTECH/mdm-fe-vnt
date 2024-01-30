import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ColumnService {

constructor(
  private baseService: BaseService,
) { }

/**API for create property */
async newColumn(request: any){
  let res = await this.baseService.postData('api/column-properties', request);
  return res;
}
}
