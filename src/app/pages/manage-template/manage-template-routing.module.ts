import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTemplateComponent } from './list-template/list-template.component';

const routes: Routes = [
  {
    path: 'list-template',
    component: ListTemplateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageTemplateRoutingModule { }
