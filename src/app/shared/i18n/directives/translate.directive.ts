import { Directive, ElementRef, effect, Input, inject, OnInit } from '@angular/core';
import { I18nService } from '../services/translation.service';

@Directive({
  selector: '[appTranslate]',
  standalone: true
})
export class TranslateDirective implements OnInit {
  @Input('appTranslate') key!: string;

  private readonly elementRef = inject(ElementRef);
  private readonly i18n = inject(I18nService);

  constructor() {
    effect(() => {
      if (this.key && this.i18n.isTranslationsLoaded()) {
        this.updateText();
      }
    });
  }

  ngOnInit(): void {
    this.updateText();
  }

  private updateText(): void {
    if (this.key) {
      this.elementRef.nativeElement.textContent = this.i18n.t(this.key);
    }
  }
}
