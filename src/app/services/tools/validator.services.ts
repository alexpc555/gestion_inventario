import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ValidatorService {
  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Solo letras (incluye acentos y ñ), SIN espacios, SIN números, SIN símbolos
  private nameRegex = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+$/;

  isRequired(value: unknown): boolean {
    return value !== null && value !== undefined && String(value).trim().length > 0;
  }

  isEmail(value: string): boolean {
    return this.emailRegex.test((value ?? '').trim());
  }

  isName(value: string): boolean {
    return this.nameRegex.test((value ?? '').trim());
  }

  minLength(value: string, min: number): boolean {
    return (value ?? '').trim().length >= min;
  }

  maxLength(value: string, max: number): boolean {
    return (value ?? '').trim().length <= max;
  }

  isStrongPassword(value: string): boolean {
    // mínimo 8, 1 mayúscula, 1 minúscula, 1 número
    const v = (value ?? '').trim();
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v);
  }

  equals(a: string, b: string): boolean {
    return (a ?? '') === (b ?? '');
  }
}