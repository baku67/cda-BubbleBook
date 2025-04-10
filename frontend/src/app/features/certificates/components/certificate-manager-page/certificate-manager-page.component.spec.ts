import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificateManagerPageComponent } from './certificate-manager-page.component';
import { CertificateService } from '../../services/certificate.service';
import { ModalService } from '../../../../shared/services/utils/modal.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../../../shared/ui-components/page-header/page-header.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { UserCertificate } from '../../models/userCertificate.model';

describe('CertificateManagerPageComponent', () => {
  let component: CertificateManagerPageComponent;
  let fixture: ComponentFixture<CertificateManagerPageComponent>;
  let certificateServiceSpy: jasmine.SpyObj<CertificateService>;
  let modalServiceSpy: jasmine.SpyObj<ModalService>;

  beforeEach(async () => {
    const certServiceSpy = jasmine.createSpyObj('CertificateService', [
      'getCertificates',
      'getCurrentUserCertificates',
      'deleteUserCertificate',
    ]);
    const modalSpy = jasmine.createSpyObj('ModalService', ['open', 'subscribeToClose']);

    await TestBed.configureTestingModule({
      declarations: [CertificateManagerPageComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        PageHeaderComponent,
        MatProgressSpinnerModule,
        MatIconModule,
      ],
      providers: [
        { provide: CertificateService, useValue: certServiceSpy },
        { provide: ModalService, useValue: modalSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificateManagerPageComponent);
    component = fixture.componentInstance;
    certificateServiceSpy = TestBed.inject(CertificateService) as jasmine.SpyObj<CertificateService>;
    modalServiceSpy = TestBed.inject(ModalService) as jasmine.SpyObj<ModalService>;

    // Mock des méthodes pour éviter les erreurs
    certificateServiceSpy.getCertificates.and.returnValue(of([])); // Retourne un Observable vide
    certificateServiceSpy.getCurrentUserCertificates.and.returnValue(of([])); // Observable vide
    certificateServiceSpy.deleteUserCertificate.and.returnValue(of(null)); // Observable de suppression

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load certificates on init', () => {
    const mockCertificates = [{ id: 1, name: 'Cert A', type: 'Type A' }];
    certificateServiceSpy.getCertificates.and.returnValue(of(mockCertificates));

    component.ngOnInit();

    expect(certificateServiceSpy.getCertificates).toHaveBeenCalled();
    expect(component.allCertificates).toEqual(mockCertificates);
    expect(component.isAllCertifsLoading).toBeFalse();
  });

  it('should handle error when loading certificates', () => {
    certificateServiceSpy.getCertificates.and.returnValue(throwError(() => new Error('Error')));

    component.ngOnInit();

    expect(certificateServiceSpy.getCertificates).toHaveBeenCalled();
    expect(component.isAllCertifsLoading).toBeFalse();
    expect(component.allCertificates).toEqual([]);
  });

  it('should toggle edit mode', () => {
    expect(component.isEditMode).toBeFalse();
    component.toggleEditMode();
    expect(component.isEditMode).toBeTrue();
  });

  it('should open add certificate modal', () => {
    component.openAddCertifModal();

    expect(modalServiceSpy.open).toHaveBeenCalledWith(
      jasmine.any(Function),
      jasmine.objectContaining({
        certificates: component.allCertificates,
        userCertificates: component.userCertificates,
      })
    );
  });

  it('should handle certificate addition from modal', () => {
    const newCert = { id: 1, certificate: { id: 3, name: 'New Cert', type: 'PADI' }, displayOrder: 1, obtainedDate: "03/12/1996", location: "Strasbourg" };
    modalServiceSpy.subscribeToClose.and.callFake((callback) => callback(newCert));

    component.openAddCertifModal();

    expect(component.userCertificates).toContain(newCert);
  });

  it('should delete certificate and update list', () => {
    const userCert = { id: 2, certificate: { id: 2, name: 'Cert B', type:'PADI' }, displayOrder: 2, obtainedDate: "03/12/1996", location: "Strasbourg" };
    component.userCertificates = [userCert];
    certificateServiceSpy.deleteUserCertificate.and.returnValue(of(null));

    component.deleteCertificate(userCert);

    expect(certificateServiceSpy.deleteUserCertificate).toHaveBeenCalledWith(2);
    expect(component.userCertificates).not.toContain(userCert);
    expect(component.isDeleting[2]).toBeFalse();
  });

  it('should handle error when deleting certificate', () => {
    const userCert = { id: 3, certificate: { id: 2, name: 'Cert B', type:'PADI' }, displayOrder: 3, obtainedDate: "03/12/1996", location: "Strasbourg" };
    component.userCertificates = [userCert];
    certificateServiceSpy.deleteUserCertificate.and.returnValue(throwError(() => new Error('Error')));

    component.deleteCertificate(userCert);

    expect(certificateServiceSpy.deleteUserCertificate).toHaveBeenCalledWith(2);
    expect(component.isDeleting[2]).toBeFalse();
    expect(component.userCertificates).toContain(userCert);
  });

  it('should reorder certificates on drag and drop', () => {
    const event: CdkDragDrop<UserCertificate[]> = {
      previousIndex: 0,
      currentIndex: 1,
      item: {} as any,
      container: {} as any,
      previousContainer: {} as any,
      isPointerOverContainer: true,
      distance: {x:0, y:0},
      dropPoint: {x:0, y:0},
      event: new MouseEvent("click"),
    };
    component.userCertificates = [
      { id: 1, certificate: { id: 1, name: 'Cert A', type: 'PADI' }, displayOrder: 1, obtainedDate: "03/12/1996", location: "Strasbourg" },
      { id: 2, certificate: { id: 2, name: 'Cert B', type: 'PADI' }, displayOrder: 2, obtainedDate: "03/12/1996", location: "Strasbourg" },
    ];

    component.drop(event);

    expect(component.userCertificates[0].certificate.id).toBe(2);
    expect(component.userCertificates[1].certificate.id).toBe(1);
  });
});
