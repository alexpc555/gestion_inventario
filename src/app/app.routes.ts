import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', loadComponent: () => import('./screens/login/login').then(m => m.LoginComponent) },
  { path: 'registro', loadComponent: () => import('./partials/registro/registro').then(m => m.RegistroComponent) },

  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./screens/dashboard/dashboard').then(m => m.DashboardComponent),
  },
  {
    path: 'categorias',
    canActivate: [authGuard],
    loadComponent: () => import('./screens/categorias/categorias').then(m => m.CategoriasComponent),
  },
    {
    path: 'proveedores',  // 👈 NUEVA RUTA
    canActivate: [authGuard],
    loadComponent: () => import('./screens/proveedores/proveedores').then(m => m.ProveedoresComponent)
  },
  

  { path: '**', redirectTo: 'login' },
];