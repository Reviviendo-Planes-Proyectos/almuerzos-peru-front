import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PwaPromptComponent } from './shared/components/pwa-prompt/pwa-prompt.component';
import { MaterialModule } from './shared/material.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MaterialModule, PwaPromptComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'almuerzos-peru-front';
}
