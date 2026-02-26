import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { ValidatorService } from '../../services/tools/validator.services';
import { AuthService } from '../../services/tools/auth.services';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [...SHARED_IMPORTS],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;

  constructor(
    private v: ValidatorService,
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.v.isEmail(this.email)) {
      alert('Correo inválido');
      return;
    }
    if (!this.v.minLength(this.password, 6)) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    this.isLoading = true;

    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.auth.saveTokens(res.access, res.refresh);
        this.router.navigateByUrl('/dashboard');
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        // SimpleJWT suele responder { detail: "No active account found..." }
        const msg = err?.error?.detail || 'Credenciales incorrectas';
        alert(msg);
      },
    });
  }
}