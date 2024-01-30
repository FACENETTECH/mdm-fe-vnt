import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class TourServiceService {

constructor(private baseService: BaseService) { }

async get() {
  let res = await this.baseService.getData(`api/tour`);
  return res;
}

async put(data: any, code: any) {
  let res = await this.baseService.putData(`api/tour/${code}`, data)
  return res;
}

}
