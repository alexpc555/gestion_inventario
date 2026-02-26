import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { CategoriesService, Category } from '../../services/tools/categories.services';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './categorias.html',
  styleUrls: ['./categorias.scss'],
})
export class CategoriasComponent implements OnInit {
  categories: Category[] = [];
  searchTerm = '';

  // modal
  isModalOpen = false;
  isDeleteOpen = false;

  // form
  editing: Category | null = null;
  formName = '';
  formDescription = '';

  // delete
  deleting: Category | null = null;

  constructor(private api: CategoriesService, private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

load() {
  this.api.list().subscribe({
    next: (data) => {
      console.log('Datos cargados:', data); // ← Agrega esto
      this.categories = data;
    },
    error: (err) => console.log(err),
  });
}

  get filtered(): Category[] {
    const t = this.searchTerm.trim().toLowerCase();
    if (!t) return this.categories;

    return this.categories.filter((c) =>
      c.name.toLowerCase().includes(t)
    );
  }

  openCreate() {
    this.editing = null;
    this.formName = '';
    this.formDescription = '';
    this.isModalOpen = true;
  }

openEdit(c: Category) {
  console.log('Editando categoría:', c); // ← Agrega esto
  this.editing = c;
  this.formName = c.name;
  this.formDescription = c.description || '';
  this.isModalOpen = true;
  console.log('Estado del modal:', this.isModalOpen); // ← Agrega esto
  this.cdr.detectChanges();  // ← Fuerza la detección de cambios
}

  closeModal() {
    this.isModalOpen = false;
    this.editing = null;
  }

  save() {
    const payload = {
      name: this.formName.trim(),
      description: this.formDescription.trim(),
      is_active: true,
    };

    if (!payload.name) return;

    // update
    if (this.editing) {
      this.api.update(this.editing.id, payload).subscribe({
        next: () => {
          this.closeModal();
          this.load();
        },
        error: (err) => console.log(err),
      });
      return;
    }

    // create
    this.api.create(payload).subscribe({
      next: () => {
        this.closeModal();
        this.load();
      },
      error: (err) => console.log(err),
    });
  }

  askDelete(c: Category) {
    this.deleting = c;
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
      error: (err) => console.log(err),
    });
  }
}