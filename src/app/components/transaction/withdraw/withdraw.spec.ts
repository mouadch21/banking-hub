import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Withdraw } from './withdraw';

describe('Withdraw', () => {
  let component: Withdraw;
  let fixture: ComponentFixture<Withdraw>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Withdraw],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Withdraw);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
