import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListBomComponent } from './list-bom/list-bom.component';

const routes: Routes = [
  {
    path: 'list-bom',
    component: ListBomComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageBomRoutingModule { }
