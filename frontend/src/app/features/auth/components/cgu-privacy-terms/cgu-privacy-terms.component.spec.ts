import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CguPrivacyTermsComponent } from './cgu-privacy-terms.component';

describe('CguPrivacyTermsComponent', () => {
  let component: CguPrivacyTermsComponent;
  let fixture: ComponentFixture<CguPrivacyTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CguPrivacyTermsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CguPrivacyTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
