import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';
import { API } from 'src/app/shared/constant/api.constant';
import { BaseService } from '../base.service';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class InforAccountService {
  constructor(
    private httpClient: HttpClient,
    private keyCloak: KeycloakService
  ) {}

  getInfoBusiness(): Observable<any> {
    return this.httpClient.get(API.BUSINESS);
  }
}
