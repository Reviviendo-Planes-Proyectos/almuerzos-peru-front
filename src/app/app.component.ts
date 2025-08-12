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
  private scrollTimeout: ReturnType<typeof setTimeout> | null = null;

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

    this.initCustomScrollIndicator();
  }

  private initCustomScrollIndicator(): void {
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  private handleScroll(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollHeight > 0) {
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const indicatorHeight = Math.max((viewportHeight / documentHeight) * 100, 3);

      const scrollProgress = (scrollTop / scrollHeight) * (100 - indicatorHeight);

      document.documentElement.style.setProperty('--scroll-progress', `${indicatorHeight}%`);
      document.documentElement.style.setProperty('--scroll-position', `${scrollProgress}%`);
    }

    document.body.classList.add('scrolling');

    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.scrollTimeout = setTimeout(() => {
      document.body.classList.remove('scrolling');
    }, 1500);
  }
}
