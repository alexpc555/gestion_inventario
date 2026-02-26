import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports'; 
import { ValidatorService } from '../../services/tools/validator.services';
import { AuthService } from '../../services/tools/auth.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './registro.html',
  styleUrls: ['./registro.scss'],
})
export class RegistroComponent {
  nombre = '';
  apellido = '';
  correo = '';
  contrasena = '';
  confirmarContrasena = '';

  // errores por campo
  errors: Record<string, string> = {};

  constructor(private v: ValidatorService, private auth: AuthService, private router: Router) {}

  private validate(): boolean {
    this.errors = {};

    // Nombre
    if (!this.v.isRequired(this.nombre)) this.errors['nombre'] = 'El nombre es obligatorio.';
    else if (!this.v.isName(this.nombre)) this.errors['nombre'] = 'Solo letras, sin espacios ni símbolos.';
    else if (!this.v.minLength(this.nombre, 2)) this.errors['nombre'] = 'Mínimo 2 letras.';
    else if (!this.v.maxLength(this.nombre, 30)) this.errors['nombre'] = 'Máximo 30 letras.';

    // Apellido
    if (!this.v.isRequired(this.apellido)) this.errors['apellido'] = 'El apellido es obligatorio.';
    else if (!this.v.isName(this.apellido)) this.errors['apellido'] = 'Solo letras, sin espacios ni símbolos.';
    else if (!this.v.minLength(this.apellido, 2)) this.errors['apellido'] = 'Mínimo 2 letras.';
    else if (!this.v.maxLength(this.apellido, 30)) this.errors['apellido'] = 'Máximo 30 letras.';

    // Correo
    if (!this.v.isRequired(this.correo)) this.errors['correo'] = 'El correo es obligatorio.';
    else if (!this.v.isEmail(this.correo)) this.errors['correo'] = 'Correo inválido.';

    // Contraseña
    if (!this.v.isRequired(this.contrasena)) this.errors['contrasena'] = 'La contraseña es obligatoria.';
    else if (!this.v.isStrongPassword(this.contrasena))
      this.errors['contrasena'] = 'Mínimo 8, 1 mayúscula, 1 minúscula y 1 número.';

    // Confirmar contraseña
    if (!this.v.isRequired(this.confirmarContrasena))
      this.errors['confirmarContrasena'] = 'Confirma tu contraseña.';
    else if (!this.v.equals(this.contrasena, this.confirmarContrasena))
      this.errors['confirmarContrasena'] = 'Las contraseñas no coinciden.';

    return Object.keys(this.errors).length === 0;
  }

  

  onSubmit() {
    if (!this.validate()) return;

    this.auth.register({
  nombre: this.nombre,
  apellido: this.apellido,
  correo: this.correo,
  contrasena: this.contrasena,
  confirmarContrasena: this.confirmarContrasena,
}).subscribe({
  next: () => {
    // te mando a login
    this.router.navigateByUrl('/login');
  },
  error: (err) => {
    // errores del backend (ej: correo ya existe)
    console.log(err.error);

    // ejemplo: si viene {correo:["..."]}
    if (err?.error?.correo?.[0]) this.errors['correo'] = err.error.correo[0];
    if (err?.error?.confirmarContrasena) this.errors['confirmarContrasena'] = err.error.confirmarContrasena;

    // si viene error general
    if (typeof err?.error === 'string') alert(err.error);
  }
});

    // Aquí luego mandas al backend
    console.log('registro ok', {
      nombre: this.nombre.trim(),
      apellido: this.apellido.trim(),
      correo: this.correo.trim(),
      contrasena: this.contrasena,
    });
  }

  // Para mostrar error solo si el usuario ya escribió algo
  touched(field: keyof RegistroComponent): boolean {
    const val = (this as any)[field];
    return typeof val === 'string' && val.length > 0;
  }
}