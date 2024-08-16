import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private baseService: BaseService) {}

  async getListUser(request: any) {
    return await this.baseService.postData(`api/users`, request);
  }

  async resgisterUser(request: any) {
    return await this.baseService.postData(`api/registration/users`, request);
  }

  async updateUser(request: any, id: string) {
    return await this.baseService.putData(
      `api/registration/users/${id}`,
      request
    );
  }

  async deleteUser(username: string) {
    return await this.baseService.deleteData(`api/users/${username}`);
  }

  async deleteGroup(groupCode: string) {
    return await this.baseService.deleteData(
      `api/registration/group-roles/${groupCode}`
    );
  }

  async getRole() {
    return await this.baseService.getData(`api/registration/roles`);
  }

  async getGroups() {
    return await this.baseService.getData(`api/registration/group-roles`);
  }

  async getGroup(groupCode: string) {
    return await this.baseService.getData(
      `api/registration/group-roles/${groupCode}`
    );
  }

  async createGroup(request: any) {
    return await this.baseService.postData(
      `api/registration/group-roles`,
      request
    );
  }

  async updateGroup(request: any) {
    return await this.baseService.putData(
      `api/registration/group-roles`,
      request
    );
  }

  async getListGroupsbyUserId(userId: string) {
    return await this.baseService.getData(`api/roles/groups/${userId}`);
  }

  async getListGroups(request: any) {
    return await this.baseService.postData(
      `api/registration/group-roles/search`,
      request
    );
  }

  async getRoleUser(userId: string) {
    return await this.baseService.getData(`api/roles/${userId}`);
  }

  async getDataAuthorities() {
    return await this.baseService.getData(`api/dataAuthorities`);
  }

  async getDataAuthoritiesByRole(role: string) {
    return await this.baseService.getData(`api/dataAuthorities/${role}`);
  }

  async updateListDataAuthorities(role: string, listDataAuthorities: any) {
    return await this.baseService.putData(
      `api/dataAuthorities/${role}`,
      listDataAuthorities
    );
  }
}
