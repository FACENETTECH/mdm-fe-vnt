/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ColumnService } from './column.service';

describe('Service: Column', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColumnService]
    });
  });

  it('should ...', inject([ColumnService], (service: ColumnService) => {
    expect(service).toBeTruthy();
  }));
});
