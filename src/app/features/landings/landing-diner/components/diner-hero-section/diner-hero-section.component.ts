import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../../shared/material.module';

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
export class DinerHeroSectionComponent implements OnInit {
  isVisible = false;
  scrollY = 0;

  stats = [
    { icon: 'star', value: '+500', label: 'restaurantes', color: 'text-orange-500' },
    { icon: 'people', value: '+10k', label: 'usuarios', color: 'text-blue-600' },
    { icon: 'location_on', value: 'Todo', label: 'Lima', color: 'text-green-600' }
  ];

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
