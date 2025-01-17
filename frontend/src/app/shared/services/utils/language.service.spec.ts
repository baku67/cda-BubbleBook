import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

describe('LanguageService', () => {
  let service: LanguageService;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    const translateSpy = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use']);

    TestBed.configureTestingModule({
      providers: [
        LanguageService,
        { provide: TranslateService, useValue: translateSpy },
      ],
    });

    service = TestBed.inject(LanguageService);
    translateServiceSpy = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with the saved language from localStorage', () => {
    localStorage.setItem('language', 'en-EN');
    const newService = new LanguageService(translateServiceSpy);

    expect(translateServiceSpy.setDefaultLang).toHaveBeenCalledWith('en-EN');
    expect(translateServiceSpy.use).toHaveBeenCalledWith('en-EN');
    expect(newService.getCurrentLang()).toBe('en-EN');
  });

  it('should initialize with the default language if no saved language exists', () => {
    const newService = new LanguageService(translateServiceSpy);

    expect(translateServiceSpy.setDefaultLang).toHaveBeenCalledWith('fr-FR');
    expect(translateServiceSpy.use).toHaveBeenCalledWith('fr-FR');
    expect(newService.getCurrentLang()).toBe('fr-FR');
  });

  it('should switch language and update localStorage', () => {
    service.switchLanguage();
    expect(service.getCurrentLang()).toBe('en-EN');
    expect(translateServiceSpy.use).toHaveBeenCalledWith('en-EN');
    expect(localStorage.getItem('language')).toBe('en-EN');

    service.switchLanguage();
    expect(service.getCurrentLang()).toBe('fr-FR');
    expect(translateServiceSpy.use).toHaveBeenCalledWith('fr-FR');
    expect(localStorage.getItem('language')).toBe('fr-FR');
  });

  it('should emit the current language via currentLang$', (done) => {
    service.currentLang$.subscribe((lang) => {
      expect(lang).toBe('fr-FR');
      done();
    });
  });
});
