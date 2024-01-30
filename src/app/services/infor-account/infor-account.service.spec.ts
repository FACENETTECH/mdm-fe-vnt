import { TestBed } from '@angular/core/testing';

import { InforAccountService } from './infor-account.service';

describe('InforAccountService', () => {
  let service: InforAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InforAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
