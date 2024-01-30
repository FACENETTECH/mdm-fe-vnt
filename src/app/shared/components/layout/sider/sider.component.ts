import { Component, OnInit, Input } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { NzI18nService, en_US } from 'ng-zorro-antd/i18n';

@Component({
  selector: 'app-sider',
  templateUrl: './sider.component.html',
  styleUrls: ['./sider.component.css'],
})
export class SiderComponent {
  @Input() sider: {
    label: string;
    open: boolean;
    path: string | null;
    icon: string;
    children: {
      label: string;
      open: boolean;
      path: string;
      requiredRoles: string[];
    }[];
    requiredRoles: string[];
  }[] = [];

  param: string = '';
  routing: any;
  navicationList: { url: string; name: string }[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private keyCloak: KeycloakService,
    private i18n: NzI18nService
  ) {
    // this.router.events.subscribe((event: any) => {
    //   if (event instanceof NavigationEnd) {
    //     this.navicationList = [];
    //     this.routing = this.router.url.slice(1);
    //     for (let i: number = 0; i < this.sider.length; i++) {
    //       if (this.sider[i].children.length !== 0) {
    //         for (let j: number = 0; j < this.sider[i].children.length; j++) {
    //           if (this.routing === this.sider[i].children[j].path) {
    //             this.sider[i].open = true;
    //             this.sider[i].children[j].open = true;
    //             break;
    //           } else {
    //             this.sider[i].open = false;
    //             this.sider[i].children[j].open = false;
    //           }
    //         }
    //       } else {
    //         if (this.routing === this.sider[i].path) {
    //           this.sider[i].open = true;
    //         } else {
    //           this.sider[i].open = false;
    //         }
    //       }
    //     }
    //   }
    // });
  }

  ngOnInit() {}

  openParent(i: number) {
    this.sider[i].open = true;
  }
  clickParent(i: number, link: any) {
    this.router.navigateByUrl(link);
    this.closeAllParentReal();
    this.closeAllChildren();
    this.sider[i].open = true;
  }
  closeAllParent(): void {
    for (let i: number = 0; i < this.sider.length; i++) {
      if (this.sider[i].children.length === 0) {
        this.sider[i].open = false;
      }
    }
  }
  closeAllParentReal(): void {
    for (let i: number = 0; i < this.sider.length; i++) {
      this.sider[i].open = false;
    }
  }
  closeParent(i: number) {
    this.sider[i].open = false;
  }
  closeAllChildren(): void {
    for (let i = 0; i < this.sider.length; ++i) {
      if (this.sider[i].children.length !== 0) {
        for (let j: number = 0; j < this.sider[i].children.length; j++) {
          this.sider[i].children[j].open = false;
        }
      }
    }
  }
  openChildren(i: number, j: number) {
    this.closeAllParentReal();
    this.closeAllChildren();
    this.sider[i].open = true;
    this.sider[i].children[j].open = true;
  }

  link(link: string) {
    this.router.navigateByUrl(link);
  }

  checkPermisson(listRole: string[]): boolean {
    const lstRoleUser: string[] = this.keyCloak.getUserRoles();
    if (this.checkRoles(listRole, lstRoleUser)) {
      return true;
    } else {
      return false;
    }
  }
  checkRoles(rolesToCheck: string[], roles: string[]): boolean {
    return rolesToCheck.some((role) => roles.includes(role));
  }
}
