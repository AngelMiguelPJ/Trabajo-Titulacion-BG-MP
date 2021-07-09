import { TestBed } from '@angular/core/testing';

import { AliquotSeguimientoService } from './aliquot-seguimiento.service';

describe('AliquotSeguimientoService', () => {
  let service: AliquotSeguimientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AliquotSeguimientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
