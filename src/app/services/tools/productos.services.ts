import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  codigo: string;
  categoria: number;
  categoria_nombre: string;
  proveedor: number;
  proveedor_nombre: string;
  stock: number;
  precio_compra: number;
  precio_venta: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductoPayload {
  nombre: string;
  descripcion?: string;
  codigo: string;
  categoria: number;
  proveedor: number;
  stock: number;
  precio_compra: number;
  precio_venta: number;
  is_active?: boolean;
}

export interface Category {
  id: number;
  name: string;
}

export interface Proveedor {
  id: number;
  nombre_empresa: string;
}

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private apiUrl = 'http://127.0.0.1:8000/api/productos/';
  private categoriesUrl = 'http://127.0.0.1:8000/api/categories/';
  private proveedoresUrl = 'http://127.0.0.1:8000/api/proveedores/';

  constructor(private http: HttpClient) {}

  // Productos
  list(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  create(data: ProductoPayload): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, data);
  }

  update(id: number, data: ProductoPayload): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  // Datos para selects
  getCategorias(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl);
  }

  getProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.proveedoresUrl);
  }

  // Endpoints adicionales
  getStockBajo(limite: number = 10): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}stock_bajo/?limite=${limite}`);
  }

  ajustarStock(id: number, cantidad: number, operacion: 'sumar' | 'restar'): Observable<any> {
    return this.http.post(`${this.apiUrl}${id}/ajustar_stock/`, {
      cantidad,
      operacion
    });
  }
}