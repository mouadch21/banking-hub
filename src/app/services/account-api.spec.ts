import { TestBed } from '@angular/core/testing';
import { AccountApi } from './account-api';

describe('AccountApi', () => {
  let service: AccountApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
