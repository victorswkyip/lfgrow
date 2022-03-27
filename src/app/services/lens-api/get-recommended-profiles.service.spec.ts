import { TestBed } from '@angular/core/testing';

import { GetRecommendedProfilesService } from './get-recommended-profiles.service';

describe('GetRecommendedProfilesService', () => {
  let service: GetRecommendedProfilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetRecommendedProfilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
