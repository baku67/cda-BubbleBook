import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateManagerPageComponent } from './certificate-manager-page.component';

describe('CertificateManagerPageComponent', () => {
  let component: CertificateManagerPageComponent;
  let fixture: ComponentFixture<CertificateManagerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateManagerPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateManagerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
