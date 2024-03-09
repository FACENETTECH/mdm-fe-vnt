import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
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
    return await this.baseService.deleteData(`api/user/groups/${groupCode}`);
  }

  async getRole() {
    return await this.baseService.getData(`api/registration/roles`);
  }

  async getGroups() {
    return await this.baseService.getData(`api/user/groups`);
  }

  async getGroup(groupCode: string) {
    return await this.baseService.getData(`api/user/groups/${groupCode}`);
  }

  async createGroup(request: any) {
    return await this.baseService.postData(`api/user/groups`, request);
  }

  async updateGroup(request: any, groupCode: string) {
    return await this.baseService.postData(
      `api/user/groups/${groupCode}`,
      request
    );
  }

  async getListGroupsbyUserId(userId: string) {
    return await this.baseService.getData(`api/user/${userId}/groups`);
  }

  async getListGroups(request: any) {
    return await this.baseService.postData(
      `api/user/groups/get-list-groups`,
      request
    );
  }

  async getRoleUser(userId: string) {
    return await this.baseService.getData(`api/roles/${userId}`);
  }
}
