import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AppI18nService {
  private language: string = 'vi';

  constructor(private translateService: TranslateService) {}

  setLanguage(lang: string) {
    if (lang == 'vi_VN') {
      this.translateService.use('vi');
    } else {
      this.translateService.use('en');
    }
  }
}
