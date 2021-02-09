import { TestBed } from '@angular/core/testing';

import { AliquotService } from './aliquot.service';

describe('AliquotService', () => {
  let service: AliquotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AliquotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
