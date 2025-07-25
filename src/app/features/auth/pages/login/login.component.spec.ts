import { Location } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { MaterialModule } from '../../../../shared/material.module';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let debugElement: DebugElement;
  let locationSpy: Location;

  beforeEach(async () => {
    const spy = {
      back: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ButtonComponent, MaterialModule, NoopAnimationsModule],
      providers: [{ provide: Location, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    locationSpy = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title "ALMUERZOS PERÚ"', () => {
    const titleElement = debugElement.query(By.css('h1'));
    expect(titleElement.nativeElement.textContent.trim()).toContain('ALMUERZOS');
    expect(titleElement.nativeElement.textContent.trim()).toContain('PERÚ');
  });

  it('should display the subtitle', () => {
    const subtitleElement = debugElement.query(By.css('p'));
    expect(subtitleElement.nativeElement.textContent.trim()).toContain('Encuentra tu');
    expect(subtitleElement.nativeElement.textContent.trim()).toContain('menú diario');
  });

  it('should render all three buttons', () => {
    const buttons = debugElement.queryAll(By.directive(ButtonComponent));
    expect(buttons.length).toBe(3);
  });

  it('should render "Empezar" button as primary', () => {
    const empezarButton = debugElement.queryAll(By.directive(ButtonComponent))[0];
    expect(empezarButton.componentInstance.label).toBe('Empezar');
    expect(empezarButton.componentInstance.isActive).toBe(true);
    expect(empezarButton.componentInstance.isOutline).toBe(false);
  });

  it('should render Google button with correct properties', () => {
    const googleButton = debugElement.queryAll(By.directive(ButtonComponent))[1];
    expect(googleButton.componentInstance.label).toBe('Ingresar con Google');
    expect(googleButton.componentInstance.isActive).toBe(true);
    expect(googleButton.componentInstance.isOutline).toBe(true);
    expect(googleButton.componentInstance.iconName).toBe('email');
  });

  it('should render Facebook button with correct properties', () => {
    const facebookButton = debugElement.queryAll(By.directive(ButtonComponent))[2];
    expect(facebookButton.componentInstance.label).toBe('Continuar con Facebook');
    expect(facebookButton.componentInstance.isActive).toBe(true);
    expect(facebookButton.componentInstance.isOutline).toBe(true);
    expect(facebookButton.componentInstance.iconName).toBe('facebook');
  });

  it('should display "OR" separator', () => {
    const separatorElement = debugElement.query(By.css('.mx-4'));
    expect(separatorElement.nativeElement.textContent.trim()).toBe('OR');
  });

  it('should display "Registrarme luego" link', () => {
    const linkElement = debugElement.query(By.css('a'));
    expect(linkElement.nativeElement.textContent.trim()).toContain('Registrarme luego');
    expect(linkElement.nativeElement.getAttribute('href')).toBe('#');
  });

  it('should have background image', () => {
    const imageElement = debugElement.query(By.css('img'));
    expect(imageElement.nativeElement.getAttribute('src')).toBe('img/background_almuerza_peru.png');
    expect(imageElement.nativeElement.getAttribute('alt')).toBe('Fondo');
  });

  it('should have proper responsive classes on main container', () => {
    const mainContainer = debugElement.query(By.css('.bg-white.rounded-lg'));
    expect(mainContainer.nativeElement.className).toContain('px-4');
    expect(mainContainer.nativeElement.className).toContain('py-6');
    expect(mainContainer.nativeElement.className).toContain('sm:px-4');
    expect(mainContainer.nativeElement.className).toContain('sm:py-6');
    expect(mainContainer.nativeElement.className).toContain('lg:px-8');
    expect(mainContainer.nativeElement.className).toMatch(/lg:py-(8|10)/);
  });

  it('should call location.back() when goBack is called', () => {
    component.goBack();
    expect(locationSpy.back).toHaveBeenCalled();
  });
});
