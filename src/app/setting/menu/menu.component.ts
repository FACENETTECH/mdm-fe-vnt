import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Menu } from 'src/app/models/menu/menu.model';
// @ts-ignore
import MenuJson from 'src/app/setting/menu.json';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  lstMenuRes?: Menu[] = MenuJson;

  @Input() isCollapsed = false;

  constructor(public keyCloak: KeycloakService) {}

  ngOnInit() {
    console.log('Menu: ', this.lstMenuRes);
  }

  access(listRole: string[]) {
    if (listRole === null) {
      return true;
    }
    return listRole.some((role: string) => {
      // return this.keyCloak.isUserInRole(role);
      // return role == 'admin_business'
      return true;
    });
  }
}

// @NgModule({
//   declarations: [MenuComponent],
//   imports: [CommonModule],
// })
// export class MenuModule {}
