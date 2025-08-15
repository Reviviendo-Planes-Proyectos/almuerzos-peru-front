import { NgModule } from '@angular/core';
import { TranslateDirective } from '../i18n/directives/translate.directive';
import { TranslatePipe } from '../i18n/pipes/translate.pipe';

const I18N_EXPORTS = [TranslatePipe, TranslateDirective];

@NgModule({
  imports: I18N_EXPORTS,
  exports: I18N_EXPORTS
})
export class I18nModule {}
