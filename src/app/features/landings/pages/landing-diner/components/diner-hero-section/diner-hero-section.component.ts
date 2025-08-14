import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';
import { BaseTranslatableComponent, MaterialModule } from '../../../../../../shared/modules';

@Component({
  selector: 'app-diner-hero-section',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './diner-hero-section.component.html',
  styleUrls: ['./diner-hero-section.component.scss'],
  animations: [
    trigger('fadeInUp', [
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('* => visible', [style({ opacity: 0, transform: 'translateY(30px)' }), animate('1000ms ease-out')])
    ])
  ]
})
export class DinerHeroSectionComponent extends BaseTranslatableComponent implements OnInit {
  isVisible = false;
  scrollY = 0;

  ngOnInit() {
    setTimeout(() => {
      this.isVisible = true;
    }, 100);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrollY = window.scrollY;
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
