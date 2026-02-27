import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
  total_products: number;
  total_compra: number;
  total_venta: number;
  total_stock: number;
  total_categorias: number;
  total_proveedores: number;
  productos_por_categoria: {
    categoria__name: string;
    total: number;
    stock_total: number;
    valor_compra: number;
    valor_venta: number;
  }[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = 'http://127.0.0.1:8000/api/dashboard/stats/';

  constructor(private http: HttpClient) {
    console.log('✅ DashboardService constructor, API URL:', this.apiUrl);
  }

  getStats(): Observable<DashboardStats> {
    console.log('📡 Haciendo petición a:', this.apiUrl);
    return this.http.get<DashboardStats>(this.apiUrl);
  }
}