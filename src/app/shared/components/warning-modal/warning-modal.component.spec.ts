import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { I18nService } from '../../i18n/services/translation.service';
import { WarningModalComponent } from './warning-modal.component';

describe('WarningModalComponent', () => {
  let component: WarningModalComponent;
  let fixture: ComponentFixture<WarningModalComponent>;
  let mockI18nService: jest.Mocked<I18nService>;

  beforeEach(async () => {
    mockI18nService = {
      t: jest.fn().mockImplementation((key: string) => {
        const translations: { [key: string]: string } = {
          'modal.close': 'Cerrar'
        };
        return translations[key] || key;
      })
    } as unknown as jest.Mocked<I18nService>;

    await TestBed.configureTestingModule({
      imports: [WarningModalComponent],
      providers: [{ provide: I18nService, useValue: mockI18nService }]
    }).compileComponents();

    fixture = TestBed.createComponent(WarningModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display modal when isVisible is true', () => {
    component.isVisible = true;
    fixture.detectChanges();

    const toastContainer = fixture.debugElement.query(By.css('.toast-container'));
    expect(toastContainer).toBeTruthy();
  });

  it('should hide modal when isVisible is false', () => {
    component.isVisible = false;
    fixture.detectChanges();

    const toastContainer = fixture.debugElement.query(By.css('.toast-container'));
    expect(toastContainer).toBeFalsy();
  });

  it('should emit primaryAction when primary button is clicked', () => {
    jest.spyOn(component.primaryAction, 'emit');

    const primaryButton = fixture.debugElement.query(By.css('.bg-orange-500'));
    primaryButton.nativeElement.click();

    expect(component.primaryAction.emit).toHaveBeenCalled();
  });

  it('should emit secondaryAction when secondary button is clicked', () => {
    jest.spyOn(component.secondaryAction, 'emit');

    const secondaryButton = fixture.debugElement.query(By.css('.text-orange-600'));
    secondaryButton.nativeElement.click();

    expect(component.secondaryAction.emit).toHaveBeenCalled();
  });

  it('should emit closeModal when close button is clicked', () => {
    jest.spyOn(component.closeModal, 'emit');

    const closeButton = fixture.debugElement.query(By.css('[aria-label="Cerrar"]'));
    closeButton.nativeElement.click();

    expect(component.closeModal.emit).toHaveBeenCalled();
  });

  it('should display custom title and message', () => {
    component.title = 'Custom Title';
    component.message = 'Custom Message';
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('h3'));
    const messageElement = fixture.debugElement.query(By.css('p'));

    expect(titleElement.nativeElement.textContent.trim()).toBe('Custom Title');
    expect(messageElement.nativeElement.textContent.trim()).toBe('Custom Message');
  });

  it('should display custom button texts', () => {
    component.primaryButtonText = 'Custom Primary';
    component.secondaryButtonText = 'Custom Secondary';
    fixture.detectChanges();

    const primaryButton = fixture.debugElement.query(By.css('.bg-orange-500'));
    const secondaryButton = fixture.debugElement.query(By.css('.text-orange-600'));

    expect(primaryButton.nativeElement.textContent.trim()).toBe('Custom Primary');
    expect(secondaryButton.nativeElement.textContent.trim()).toBe('Custom Secondary');
  });

  // Removemos el test de backdrop click ya que ahora es un toast sin backdrop
  it('should not have backdrop in toast mode', () => {
    component.isVisible = true;
    fixture.detectChanges();

    const backdrop = fixture.debugElement.query(By.css('.fixed.inset-0'));
    expect(backdrop).toBeFalsy();
  });

  it('should show toast content when visible', () => {
    component.isVisible = true;
    fixture.detectChanges();

    const toastContent = fixture.debugElement.query(By.css('.toast-content'));
    expect(toastContent).toBeTruthy();
  });
});
