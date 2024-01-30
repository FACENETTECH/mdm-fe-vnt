/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ManageStageService } from './manage-stage.service';

describe('Service: ManageStage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageStageService]
    });
  });

  it('should ...', inject([ManageStageService], (service: ManageStageService) => {
    expect(service).toBeTruthy();
  }));
});
