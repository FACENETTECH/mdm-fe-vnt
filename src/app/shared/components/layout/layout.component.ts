import { Component, OnInit, NgModule, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'fn-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  selectedRoute = '';
  isSider: boolean = true;
  classLayout = {
    sider: 'sider',
    content: 'content',
  };

  menuOpened: boolean = false;
  temporaryMenuOpened = false;

  // @Input()
  // title: string;

  @Input() data: any;

  menuMode = 'shrink';
  menuRevealMode = 'expand';
  minMenuSize = 0;
  shaderEnabled = false;

  constructor(private router: Router) {}

  ngOnInit() {}

  get hideMenuAfterNavigation() {
    return this.menuMode === 'overlap' || this.temporaryMenuOpened;
  }

  get showMenuAfterClick() {
    return !this.menuOpened;
  }

  changeSider() {
    this.isSider = !this.isSider;
    this.changeClass();
  }

  changeClass() {
    if (this.isSider) {
      this.classLayout = {
        sider: 'sider',
        content: 'content',
      };
    } else {
      this.classLayout = {
        sider: 'sider2',
        content: 'content2',
      };
    }
  }

  navigationClick() {
    if (this.showMenuAfterClick) {
      this.temporaryMenuOpened = true;
      this.menuOpened = true;
    }
  }
}
