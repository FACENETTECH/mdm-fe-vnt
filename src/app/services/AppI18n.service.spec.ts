/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AppI18nService } from './AppI18n.service';

describe('Service: AppI18n', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppI18nService]
    });
  });

  it('should ...', inject([AppI18nService], (service: AppI18nService) => {
    expect(service).toBeTruthy();
  }));
});
