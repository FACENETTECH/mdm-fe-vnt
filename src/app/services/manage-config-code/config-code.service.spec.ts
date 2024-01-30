/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ConfigCodeService } from './config-code.service';

describe('Service: ConfigCode', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigCodeService]
    });
  });

  it('should ...', inject([ConfigCodeService], (service: ConfigCodeService) => {
    expect(service).toBeTruthy();
  }));
});
