import { TestBed } from '@angular/core/testing';

import { GetProfilesService } from './get-profiles.service';

describe('GetProfilesService', () => {
  let service: GetProfilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetProfilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
