import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageMachineComponent } from './pages/manage-machine-line/manage-machine/manage-machine.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'mdm',
    loadChildren: () =>
      import('./pages/manage-machine-line/manage-machine-line.module').then(
        (m) => m.ManageMachineLineModule
      ),
  },
  {
    path: 'manage-config',
    loadChildren: () =>
      import('./pages/manage-config/manage-config.module').then(
        (m) => m.ManageConfigModule
      ),
    // canActivate: [AuthGuard],
    // data: {
    //   requiredRoles: [
    //     'mdm_config-manage',
    //     'mdm_config-machine',
    //     'mdm_config-stage',
    //     'mdm_config-error',
    //     'mdm_config-provider',
    //     'mdm_config-employee',
    //     'mdm_config-metarial',
    //     'mdm_config-product',
    //   ],
    // },
  },
  {
    path: 'manage-account',
    loadChildren: () =>
      import('./pages/manage-account/manage-account.module').then(
        (m) => m.ManageAccountModule
      ),
  },
  {
    path: 'exception',
    loadChildren: () =>
      import('./shared/exception/exception.module').then(
        (m) => m.ExceptionModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
