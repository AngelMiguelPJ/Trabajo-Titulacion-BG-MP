import { TestBed } from '@angular/core/testing';

import { RegisteradminGuard } from './registeradmin.guard';

describe('RegisteradminGuard', () => {
  let guard: RegisteradminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RegisteradminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
