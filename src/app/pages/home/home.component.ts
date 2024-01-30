import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzI18nService, en_US } from 'ng-zorro-antd/i18n';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  next(data: string) {
    this.router.navigateByUrl(data);
  }
}
