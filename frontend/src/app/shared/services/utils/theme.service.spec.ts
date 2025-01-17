import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);

    // Réinitialisation de `localStorage` avant chaque test
    localStorage.clear();
    // Suppression de toutes les classes du `document.body`
    document.body.className = '';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with the saved theme from localStorage', () => {
    localStorage.setItem('theme', 'light-theme');
    const newService = new ThemeService();
    expect(document.body.classList.contains('light-theme')).toBeTrue();
  });

  it('should default to "dark-theme" if no theme is saved in localStorage', () => {
    const newService = new ThemeService();
    expect(document.body.classList.contains('dark-theme')).toBeTrue();
  });

  it('should toggle the theme between light and dark', () => {
    service.setTheme('light-theme');
    expect(document.body.classList.contains('light-theme')).toBeTrue();

    service.toggleTheme();
    expect(document.body.classList.contains('dark-theme')).toBeTrue();
    expect(localStorage.getItem('theme')).toBe('dark-theme');

    service.toggleTheme();
    expect(document.body.classList.contains('light-theme')).toBeTrue();
    expect(localStorage.getItem('theme')).toBe('light-theme');
  });

  it('should set the theme to a specified value', () => {
    service.setTheme('light-theme');
    expect(document.body.classList.contains('light-theme')).toBeTrue();
    expect(localStorage.getItem('theme')).toBe('light-theme');

    service.setTheme('dark-theme');
    expect(document.body.classList.contains('dark-theme')).toBeTrue();
    expect(localStorage.getItem('theme')).toBe('dark-theme');
  });

  it('should return the current theme', () => {
    service.setTheme('dark-theme');
    expect(service.getTheme()).toBe('dark-theme');

    service.setTheme('light-theme');
    expect(service.getTheme()).toBe('light-theme');
  });
});
