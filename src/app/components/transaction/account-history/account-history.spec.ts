import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AccountHistory } from './account-history';

describe('AccountHistory', () => {
  let component: AccountHistory;
  let fixture: ComponentFixture<AccountHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountHistory],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
