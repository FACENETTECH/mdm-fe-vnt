import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageMachineComponent } from './manage-machine/manage-machine.component';

let functions = JSON.parse(localStorage.getItem('baseUrl')!); // Lấy ra thông tin chức năng cha
let isSiderLv1 = functions.children.length > 0 ? false : true; // Kiểm tra xem chức năng cha có chức năng con hay không

/**
 * Đây là khối lệnh xử lý router
 * Nếu là chức năng không có chức năng con sẽ redirect trực tiếp (BLOCK điều kiện đúng)
 * Nếu là chức năng có chức năng con sẽ redirect với baseUrl là tên của chức năng cha (BLOCK điều kiện sai)
 */
const routes: Routes = isSiderLv1? [
  {
    path: ':id',
    component: ManageMachineComponent,
  },
  {
    path: ':id/new',
    component: ManageMachineComponent,
  },
  {
    path: ':id/update',
    component: ManageMachineComponent,
  },
  {
    path: ':id/view-detail',
    component: ManageMachineComponent,
  }
] : [
  {
    path: `${functions.name}/:id`,
    component: ManageMachineComponent,
  },
  {
    path: `${functions.name}/:id/new`,
    component: ManageMachineComponent,
  },
  {
    path: `${functions.name}/:id/update`,
    component: ManageMachineComponent,
  },
  {
    path: `${functions.name}/:id/view-detail`,
    component: ManageMachineComponent,
  }
]
;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageMachineLineRoutingModule {}
