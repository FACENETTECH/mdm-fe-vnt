import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';

const api_end_point = environment.api_end_point;

@Injectable({
  providedIn: 'root'
})
export class ConfigCodeService {

constructor(
  private http: HttpClient,
) { }


/**API to get list config code */
getListConfigCode(request: any){
  return this.http.post(`${api_end_point}/api/code-configuration`, request);
}

/**API to update detail config  */
updateDetailCode(entityType?: number, keyName?: string, validateStatus?: number, request?: any){
  return this.http.post(`${api_end_point}/api/code-configuration/save-update/${entityType}/${keyName}/${validateStatus}`, request)
}

/**API to get list detail config */
getListDetailConfigCode(entityType?: number, keyName?: string, request?: any){
  return this.http.post(`${api_end_point}/api/code-configuration/get-code-configuration/${entityType}/${keyName}`, request);
}

/**APi to delete config code */
deleteConfigCode(entityType?: number, keyName?: string){
  return this.http.delete(`${api_end_point}/api/code-configuration/delete-code-configuration-column/${entityType}/${keyName}`);
}

/**API to import excel */
import(file: any){
  return this.http.post(`${api_end_point}/api/code-configuration/import-excel`, file);
}

/**API autocomplete common*/
commonAutocomplete(request: any){
  return this.http.post(`${api_end_point}/api/code-configuration/import-excel`, request);
}

/**API to gen code */
genCode(request: any, entityType?: number, keyName?: string){
  return this.http.post(`${api_end_point}/api/code-configuration/gen-code/${entityType}/${keyName}`, request);
}

/**API to get columns */
getAllColumn(request: any){
  return this.http.post(`${api_end_point}/api/column-properties/get-all`, request);

}

/**API get column by entityType */
getColumnbyEntityType(entityType: number){
  return this.http.get(`${environment.api_end_point}/api/column-properties/${entityType}`);
}


}
