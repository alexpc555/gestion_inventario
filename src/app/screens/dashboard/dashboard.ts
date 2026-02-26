import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { Router } from '@angular/router';

type AlertPriority = 'CRITICAL' | 'HIGH';

interface ProductAlert {
  name: string;
  currentStock: number;
  minimumStock?: number;
  reorderPoint?: number;
  priority: AlertPriority;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent {
  // --- KPIs (mock por ahora)
  totalProducts = 7;
  activeProducts = 7;

  totalInventoryValue = 8196;
  totalSaleValue = 13107;

  lowStockProducts = 1;
  criticalStockProducts = 3;
  outOfStockProducts = 1;

  criticalAlerts: ProductAlert[] = [
    { name: 'Mouse Logitech MX Master', currentStock: 3, minimumStock: 10, priority: 'CRITICAL' },
    { name: 'Jeans Denim Premium', currentStock: 2, minimumStock: 15, priority: 'CRITICAL' },
    { name: 'Monitor 27" 4K', currentStock: 0, minimumStock: 3, priority: 'CRITICAL' },
  ];

  highAlerts: ProductAlert[] = [
    { name: 'Laptop HP ProBook', currentStock: 8, reorderPoint: 10, priority: 'HIGH' },
  ];

  constructor(private router: Router) {}

  go(path: string) {
    // Cambia estas rutas cuando tengas las pantallas reales
    // ejemplo: this.router.navigateByUrl('/productos')
    this.router.navigateByUrl(path);
  }
}