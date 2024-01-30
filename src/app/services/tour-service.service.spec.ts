/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TourServiceService } from './tour-service.service';

describe('Service: TourService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TourServiceService]
    });
  });

  it('should ...', inject([TourServiceService], (service: TourServiceService) => {
    expect(service).toBeTruthy();
  }));
});
