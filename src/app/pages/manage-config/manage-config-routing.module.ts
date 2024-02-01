import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigTableComponent } from './config-table/config-table.component';
import { ConfigComponent } from './config/config.component';
import { PreviewComponent } from './preview/preview.component';

const routes: Routes = [
  {
    path: ':id',
    component: ConfigComponent
  },
  {
    path: ':id/preview',
    component: PreviewComponent
  },
  {
    path: 'config-table/list-config',
    component: ConfigTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageConfigRoutingModule { }
