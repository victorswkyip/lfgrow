import { TestBed } from '@angular/core/testing';

import { ApolloClientService } from './apollo-client.service';

describe('ApolloClientService', () => {
  let service: ApolloClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApolloClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
