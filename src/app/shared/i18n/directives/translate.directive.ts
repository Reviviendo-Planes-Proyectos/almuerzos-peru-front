import { Directive, ElementRef, effect, Input, inject, OnInit } from '@angular/core';
import { I18nService } from '../services/translation.service';

@Directive({
  selector: '[appTranslate]',
  standalone: true
})
export class TranslateDirective implements OnInit {
  @Input('appTranslate') key!: string;
  @Input() placeholder?: string;

  private readonly elementRef = inject(ElementRef);
  private readonly i18n = inject(I18nService);

  constructor() {
    effect(() => {
      if (this.key) {
        this.updateText();
      }
    });
  }

  ngOnInit(): void {
    this.updateText();
  }

  private updateText(): void {
    if (!this.key) return;

    // Optimizado para evitar flash de contenido
    if (!this.i18n.isReady()) {
      // Mostrar placeholder o dejar vacío durante la carga
      this.elementRef.nativeElement.textContent = this.placeholder || '';
      return;
    }

    this.elementRef.nativeElement.textContent = this.i18n.t(this.key);
  }
}
