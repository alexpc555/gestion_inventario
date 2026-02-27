import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { ProductosService, Producto, Category, Proveedor, ProductoPayload } from '../../services/tools/productos.services';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './productos.html',
  styleUrls: ['./productos.scss']
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  categorias: Category[] = [];
  proveedores: Proveedor[] = [];
  searchTerm = '';

  // Modal states
  isModalOpen = false;
  isDeleteOpen = false;
  isStockModalOpen = false;

  // Form
  editing: Producto | null = null;
  formNombre = '';
  formDescripcion = '';
  formCodigo = '';
  formCategoria = 0;
  formProveedor = 0;
  formStock = 0;
  formPrecioCompra = 0;
  formPrecioVenta = 0;

  // Stock adjustment
  ajustandoStock: Producto | null = null;
  stockCantidad = 0;
  stockOperacion: 'sumar' | 'restar' = 'sumar';

  // Delete
  deleting: Producto | null = null;

  constructor(private api: ProductosService) {}

  ngOnInit(): void {
    this.load();
    this.loadCategorias();
    this.loadProveedores();
  }

  load() {
    this.api.list().subscribe({
      next: (data) => {
        console.log('Productos cargados:', data);
        this.productos = data;
      },
      error: (err) => console.log('Error cargando productos:', err)
    });
  }

  loadCategorias() {
    this.api.getCategorias().subscribe({
      next: (data) => {
        console.log('Categorías cargadas:', data);
        this.categorias = data;
      },
      error: (err) => console.log('Error cargando categorías:', err)
    });
  }

  loadProveedores() {
    this.api.getProveedores().subscribe({
      next: (data) => {
        console.log('Proveedores cargados:', data);
        this.proveedores = data;
      },
      error: (err) => console.log('Error cargando proveedores:', err)
    });
  }

  get filtered(): Producto[] {
    const t = this.searchTerm.trim().toLowerCase();
    if (!t) return this.productos;
    
    return this.productos.filter(p => 
      p.nombre.toLowerCase().includes(t) ||
      p.codigo.toLowerCase().includes(t) ||
      p.categoria_nombre.toLowerCase().includes(t) ||
      p.proveedor_nombre.toLowerCase().includes(t)
    );
  }

  openCreate() {
    console.log('Abriendo modal de creación');
    // Recargar categorías y proveedores antes de abrir el modal
    this.loadCategorias();
    this.loadProveedores();
    
    this.editing = null;
    this.resetForm();
    this.isModalOpen = true;
  }

  openEdit(p: Producto) {
    console.log('Editando producto:', p);
    // Recargar categorías y proveedores antes de abrir el modal
    this.loadCategorias();
    this.loadProveedores();
    
    this.editing = p;
    this.formNombre = p.nombre;
    this.formDescripcion = p.descripcion || '';
    this.formCodigo = p.codigo;
    this.formCategoria = p.categoria;
    this.formProveedor = p.proveedor;
    this.formStock = p.stock;
    this.formPrecioCompra = p.precio_compra;
    this.formPrecioVenta = p.precio_venta;
    this.isModalOpen = true;
  }

  openStockModal(p: Producto) {
    this.ajustandoStock = p;
    this.stockCantidad = 0;
    this.stockOperacion = 'sumar';
    this.isStockModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.editing = null;
    this.resetForm();
  }

  closeStockModal() {
    this.isStockModalOpen = false;
    this.ajustandoStock = null;
  }

  resetForm() {
    this.formNombre = '';
    this.formDescripcion = '';
    this.formCodigo = '';
    this.formCategoria = 0;
    this.formProveedor = 0;
    this.formStock = 0;
    this.formPrecioCompra = 0;
    this.formPrecioVenta = 0;
  }

  save() {
    // Validaciones
    if (!this.formNombre || !this.formCodigo || !this.formCategoria || !this.formProveedor) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    if (this.formPrecioVenta < this.formPrecioCompra) {
      alert('El precio de venta no puede ser menor al precio de compra');
      return;
    }

    const payload: ProductoPayload = {
      nombre: this.formNombre.trim(),
      descripcion: this.formDescripcion.trim() || '',
      codigo: this.formCodigo.trim().toUpperCase(),
      categoria: this.formCategoria,
      proveedor: this.formProveedor,
      stock: this.formStock || 0,
      precio_compra: this.formPrecioCompra || 0,
      precio_venta: this.formPrecioVenta || 0,
      is_active: true
    };

    if (this.editing) {
      // Actualizar
      this.api.update(this.editing.id, payload).subscribe({
        next: () => {
          this.closeModal();
          this.load();
        },
        error: (err) => {
          console.log('Error actualizando:', err);
          alert('Error al actualizar el producto');
        }
      });
    } else {
      // Crear
      this.api.create(payload).subscribe({
        next: () => {
          this.closeModal();
          this.load();
        },
        error: (err) => {
          console.log('Error creando:', err);
          alert('Error al crear el producto');
        }
      });
    }
  }

  ajustarStock() {
    if (!this.ajustandoStock || this.stockCantidad <= 0) return;

    this.api.ajustarStock(this.ajustandoStock.id, this.stockCantidad, this.stockOperacion).subscribe({
      next: (response) => {
        console.log('Stock ajustado:', response);
        this.closeStockModal();
        this.load();
      },
      error: (err) => {
        console.log('Error ajustando stock:', err);
        alert('Error al ajustar el stock');
      }
    });
  }

  askDelete(p: Producto) {
    this.deleting = p;
    this.isDeleteOpen = true;
  }

  cancelDelete() {
    this.isDeleteOpen = false;
    this.deleting = null;
  }

  confirmDelete() {
    if (!this.deleting) return;
    
    this.api.delete(this.deleting.id).subscribe({
      next: () => {
        this.cancelDelete();
        this.load();
      },
      error: (err) => {
        console.log('Error eliminando:', err);
        alert('Error al eliminar el producto');
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  }
}