import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PwaPromptComponent } from './shared/components/pwa-prompt/pwa-prompt.component';
import { MaterialModule } from './shared/material.module';
import { ApiService } from './shared/services/api/api.service';
import { LoggerService } from './shared/services/logger/logger.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MaterialModule, PwaPromptComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  apiStatus: any;

  constructor(
    private readonly apiService: ApiService,
    public readonly logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.apiService.getHealth().subscribe({
      next: (data) => {
        this.apiStatus = data;
        this.logger.info('API status fetched successfully:', this.apiStatus);
      },
      error: (err) => {
        this.apiStatus = err;
        this.logger.error('Error fetching API status:', this.apiStatus);
      }
    });
  }
}
