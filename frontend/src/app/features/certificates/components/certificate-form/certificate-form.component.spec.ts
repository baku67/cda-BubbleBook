import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CertificateFormComponent } from './certificate-form.component';
import { CertificateService } from '../../services/certificate.service';
import { ModalService } from '../../../../shared/services/utils/modal.service';
import { of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CertificateFormComponent', () => {
  let component: CertificateFormComponent;
  let fixture: ComponentFixture<CertificateFormComponent>;
  let certificateServiceSpy: jasmine.SpyObj<CertificateService>;
  let modalServiceSpy: jasmine.SpyObj<ModalService>;

  beforeEach(async () => {
    const certServiceSpy = jasmine.createSpyObj('CertificateService', ['addCertificateToUser']);
    const modalSpy = jasmine.createSpyObj('ModalService', ['close']);

    await TestBed.configureTestingModule({
      declarations: [CertificateFormComponent],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatOptionModule,
        BrowserAnimationsModule,
      ],
      providers: [
        FormBuilder,
        { provide: CertificateService, useValue: certServiceSpy },
        { provide: ModalService, useValue: modalSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificateFormComponent);
    component = fixture.componentInstance;
    certificateServiceSpy = TestBed.inject(CertificateService) as jasmine.SpyObj<CertificateService>;
    modalServiceSpy = TestBed.inject(ModalService) as jasmine.SpyObj<ModalService>;

    // Valeurs par défaut pour les certificats et organisations
    component.certificates = [
      { id: 1, name: 'Cert A', type: 'Org 1' },
      { id: 2, name: 'Cert B', type: 'Org 2' },
    ];
    component.userCertificates = [{ id: 1, certificate: { id: 1, name: 'Cert A', type: 'Org 1' }, displayOrder: 1, obtainedDate: "03/12/1996", location: "Strasbourg" }];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form and organisations', () => {
    expect(component.addCertificateForm).toBeDefined();
    expect(component.organisations).toEqual(['Org 1', 'Org 2']);
  });

  it('should filter certificates based on selected organisation', () => {
    component.addCertificateForm.get('organisationValue')?.setValue('Org 2');
    expect(component.filteredCertificates).toEqual([{ id: 2, name: 'Cert B', type: 'Org 2' }]);
  });

  it('should not include user-owned certificates in the filtered list', () => {
    component.addCertificateForm.get('organisationValue')?.setValue('Org 1');
    expect(component.filteredCertificates).toEqual([]);
  });

  it('should submit the form when valid', () => {
    const mockCertificate = { id: 3, name: 'Cert C', type: 'Org 2' };
    certificateServiceSpy.addCertificateToUser.and.returnValue(of(mockCertificate));

    component.addCertificateForm.setValue({
      organisationValue: 'Org 2',
      certificateValue: 'Cert C',
      obtainedDate: '2023-12-31',
      location: 'Location',
    });

    component.onSubmit();

    expect(certificateServiceSpy.addCertificateToUser).toHaveBeenCalledWith(component.addCertificateForm.value);
    expect(modalServiceSpy.close).toHaveBeenCalledWith(mockCertificate);
    expect(component.isLoading).toBeTrue(); // Le spinner reste actif jusqu’à la fermeture du modal
  });

  it('should handle submission error', () => {
    certificateServiceSpy.addCertificateToUser.and.returnValue(throwError(() => new Error('Request failed')));

    component.addCertificateForm.setValue({
      organisationValue: 'Org 2',
      certificateValue: 'Cert C',
      obtainedDate: '2023-12-31',
      location: 'Location',
    });

    component.onSubmit();

    expect(certificateServiceSpy.addCertificateToUser).toHaveBeenCalled();
    expect(component.errorMessage).toBe('There was an error adding a certificate. Try again later');
    expect(component.isLoading).toBeFalse();
  });

  it('should set errorMessage if form is invalid', () => {
    component.addCertificateForm.setValue({
      organisationValue: '',
      certificateValue: '',
      obtainedDate: null,
      location: null,
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Please fill in all required fields correctly.');
    expect(component.isLoading).toBeFalse();
  });
});
