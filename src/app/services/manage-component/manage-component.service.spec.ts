import { TestBed } from '@angular/core/testing';

import { ManageComponentService } from './manage-component.service';

describe('ManageComponentService', () => {
  let service: ManageComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
