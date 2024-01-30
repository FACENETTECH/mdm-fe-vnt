/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InfoMachineService } from './info-machine.service';

describe('Service: InfoMachine', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InfoMachineService]
    });
  });

  it('should ...', inject([InfoMachineService], (service: InfoMachineService) => {
    expect(service).toBeTruthy();
  }));
});
