import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { LoginComponent } from './login.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { MaterialModule } from '../../../../shared/material.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ButtonComponent, MaterialModule, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
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
    expect(subtitleElement.nativeElement.textContent.trim()).toBe('Encuentra tu menú diario, ¡sin perder tiempo!');
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

  it('should display "Regístrate más tarde" link', () => {
    const linkElement = debugElement.query(By.css('a'));
    expect(linkElement.nativeElement.textContent.trim()).toBe('Regístrate más tarde');
    expect(linkElement.nativeElement.getAttribute('href')).toBe('#');
  });

  it('should have background image', () => {
    const imageElement = debugElement.query(By.css('img'));
    expect(imageElement.nativeElement.getAttribute('src')).toBe('img/background_almuerza_peru.png');
    expect(imageElement.nativeElement.getAttribute('alt')).toBe('Fondo');
  });

  it('should have proper responsive classes on main container', () => {
    const mainContainer = debugElement.query(By.css('.bg-white'));
    expect(mainContainer.nativeElement.className).toContain('px-4');
    expect(mainContainer.nativeElement.className).toContain('py-6');
    expect(mainContainer.nativeElement.className).toContain('sm:px-4');
    expect(mainContainer.nativeElement.className).toContain('sm:py-6');
    expect(mainContainer.nativeElement.className).toContain('lg:px-8');
    expect(mainContainer.nativeElement.className).toContain('lg:py-10');
  });
});
