import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { Router } from '@angular/router';
import { AuthService } from '../../services/tools/auth.services';
import { DashboardService, DashboardStats } from '../../services/tools/dashboard.services';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {
  // KPIs
  totalProducts = 0;
  totalCompra = 0;
  totalVenta = 0;
  totalStock = 0;
  totalCategorias = 0;
  totalProveedores = 0;
  potentialProfit = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private dashboardService: DashboardService
  ) {
    console.log('✅ DashboardComponent constructor');
  }

  ngOnInit(): void {
    console.log('✅ DashboardComponent ngOnInit');
    this.loadStats();
  }

  loadStats() {
    console.log('📡 Cargando estadísticas del dashboard...');
    
    this.dashboardService.getStats().subscribe({
      next: (data: DashboardStats) => {
        console.log('✅ Datos recibidos del backend:', data);
        
        this.totalProducts = data.total_products;
        this.totalCompra = data.total_compra;
        this.totalVenta = data.total_venta;
        this.totalStock = data.total_stock;
        this.totalCategorias = data.total_categorias;
        this.totalProveedores = data.total_proveedores;
        this.potentialProfit = data.total_venta - data.total_compra;
        
        console.log('📊 Valores actualizados:', {
          totalProducts: this.totalProducts,
          totalCompra: this.totalCompra,
          totalVenta: this.totalVenta,
          totalStock: this.totalStock,
          totalCategorias: this.totalCategorias,
          totalProveedores: this.totalProveedores,
          potentialProfit: this.potentialProfit
        });
      },
      error: (err) => {
        console.log('❌ Error cargando estadísticas:', err);
        console.log('❌ Status:', err.status);
        console.log('❌ Message:', err.message);
        console.log('❌ URL:', err.url);
      }
    });
  }

  go(path: string) {
    this.router.navigateByUrl(path);
  }

  logout() {
    console.log('🚪 Cerrando sesión...');
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}