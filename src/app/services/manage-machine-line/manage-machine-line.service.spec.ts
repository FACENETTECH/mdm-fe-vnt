/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ManageMachineLineService } from './manage-machine-line.service';

describe('Service: ManageMachineLine', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageMachineLineService]
    });
  });

  it('should ...', inject([ManageMachineLineService], (service: ManageMachineLineService) => {
    expect(service).toBeTruthy();
  }));
});
