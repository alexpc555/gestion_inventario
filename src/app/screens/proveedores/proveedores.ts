import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { ProveedoresService, Proveedor } from '../../services/tools/proveedores.services';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './proveedores.html',
  styleUrls: ['./proveedores.scss']
})
export class ProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = [];
  searchTerm = '';

  // Modal states
  isModalOpen = false;
  isDeleteOpen = false;

  // Form
  editing: Proveedor | null = null;
  formNombreEmpresa = '';
  formNombreContacto = '';
  formEmail = '';
  formTelefono = '';
  formDireccion = '';

  // Delete
  deleting: Proveedor | null = null;

  constructor(private api: ProveedoresService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.api.list().subscribe({
      next: (data) => {
        console.log('Proveedores cargados:', data);
        this.proveedores = data;
      },
      error: (err) => console.log('Error cargando proveedores:', err)
    });
  }

  get filtered(): Proveedor[] {
    const t = this.searchTerm.trim().toLowerCase();
    if (!t) return this.proveedores;
    
    return this.proveedores.filter(p => 
      p.nombre_empresa.toLowerCase().includes(t) ||
      p.nombre_contacto.toLowerCase().includes(t) ||
      p.email.toLowerCase().includes(t)
    );
  }

  openCreate() {
    console.log('Abriendo modal de creación');
    this.editing = null;
    this.resetForm();
    this.isModalOpen = true;
  }

  openEdit(p: Proveedor) {
    console.log('Editando proveedor:', p);
    this.editing = p;
    this.formNombreEmpresa = p.nombre_empresa;
    this.formNombreContacto = p.nombre_contacto;
    this.formEmail = p.email;
    this.formTelefono = p.telefono;
    this.formDireccion = p.direccion || '';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.editing = null;
    this.resetForm();
  }

  resetForm() {
    this.formNombreEmpresa = '';
    this.formNombreContacto = '';
    this.formEmail = '';
    this.formTelefono = '';
    this.formDireccion = '';
  }

  save() {
    const payload = {
      nombre_empresa: this.formNombreEmpresa.trim(),
      nombre_contacto: this.formNombreContacto.trim(),
      email: this.formEmail.trim(),
      telefono: this.formTelefono.trim(),
      direccion: this.formDireccion.trim() || '',
      is_active: true
    };

    // Validaciones básicas
    if (!payload.nombre_empresa || !payload.nombre_contacto || !payload.email || !payload.telefono) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    // Email validation simple
    if (!payload.email.includes('@')) {
      alert('Por favor ingresa un email válido');
      return;
    }

    if (this.editing) {
      // Actualizar
      this.api.update(this.editing.id, payload).subscribe({
        next: () => {
          this.closeModal();
          this.load();
        },
        error: (err) => {
          console.log('Error actualizando:', err);
          alert('Error al actualizar el proveedor');
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
          alert('Error al crear el proveedor');
        }
      });
    }
  }

  askDelete(p: Proveedor) {
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
        alert('Error al eliminar el proveedor');
      }
    });
  }
}