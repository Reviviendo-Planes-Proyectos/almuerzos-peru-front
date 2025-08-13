import { NgModule } from '@angular/core';
import { CoreModule } from './core.module';
import { MaterialModule } from './material.module';
import { SharedComponentsModule } from './shared-components.module';

@NgModule({
  imports: [CoreModule, MaterialModule, SharedComponentsModule],
  exports: [CoreModule, MaterialModule, SharedComponentsModule]
})
export class SharedModule {}
