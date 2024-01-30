/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InfoLineService } from './info-line.service';

describe('Service: InfoLine', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InfoLineService]
    });
  });

  it('should ...', inject([InfoLineService], (service: InfoLineService) => {
    expect(service).toBeTruthy();
  }));
});
