import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BannerSelectionComponent } from './banner-selection.component';
import { ModalService } from '../../../../shared/services/utils/modal.service';

describe('BannerSelectionComponent', () => {
  let component: BannerSelectionComponent;
  let fixture: ComponentFixture<BannerSelectionComponent>;
  let modalServiceSpy: jasmine.SpyObj<ModalService>;

  beforeEach(async () => {
    const modalSpy = jasmine.createSpyObj('ModalService', ['close']);

    await TestBed.configureTestingModule({
      declarations: [BannerSelectionComponent],
      providers: [{ provide: ModalService, useValue: modalSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(BannerSelectionComponent);
    component = fixture.componentInstance;
    modalServiceSpy = TestBed.inject(ModalService) as jasmine.SpyObj<ModalService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log an error if no banners are provided', () => {
    spyOn(console, 'error');
    component.banners = [];
    component.ngOnInit();
    expect(console.error).toHaveBeenCalledWith('Aucune bannière reçue dans le modal.');
  });

  it('should log received banners if banners are provided', () => {
    spyOn(console, 'log');
    component.banners = ['banner1.jpg', 'banner2.jpg'];
    component.ngOnInit();
    expect(console.log).toHaveBeenCalledWith('Bannières reçues dans le modal :', ['banner1.jpg', 'banner2.jpg']);
  });

  it('should select a banner and call onClose callback', () => {
    const mockCallback = jasmine.createSpy('onClose');
    component.onClose = mockCallback;
    component.banners = ['banner1.jpg', 'banner2.jpg'];
    component.selectedBanner = '';

    component.selectBanner('banner2.jpg');
    expect(component.selectedBanner).toBe('banner2.jpg');
    expect(mockCallback).toHaveBeenCalledWith('banner2.jpg');
  });

  it('should close the modal after selecting a banner', (done) => {
    component.banners = ['banner1.jpg', 'banner2.jpg'];
    component.selectedBanner = '';
    component.onClose = () => {}; // Stub to avoid undefined callback

    component.selectBanner('banner1.jpg');

    setTimeout(() => {
      expect(modalServiceSpy.close).toHaveBeenCalled();
      done(); // Indique que le test asynchrone est terminé
    }, 500);
  });
});
