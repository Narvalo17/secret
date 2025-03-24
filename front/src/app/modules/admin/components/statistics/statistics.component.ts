import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-statistics',
  template: `
    <div class="statistics">
      <h2>Statistiques</h2>
      <p>Cette fonctionnalité sera bientôt disponible.</p>
    </div>
  `,
  styles: [`
    .statistics {
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class StatisticsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
} 