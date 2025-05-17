import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2'; //muestra alertas estilizadas

//decorador del componente
@Component({
  selector: 'app-signin', //identifica el componente en la plantilla
  templateUrl: './signin.component.html', //ruta al archivo HTML del componente
  styleUrls: ['./signin.component.scss'], //ruta al archivo de estilos SCSS
  standalone: true,
  imports: [
    FormsModule, //manejo de formularios
    ReactiveFormsModule, //manejo de formularios reactivos
    MatFormFieldModule, //formulario de Angular Material
    MatInputModule, //entrada de Angular Material
    MatIconModule, //iconos de Angular Material
    MatButtonModule, //botones de Angular Material
  ]
})
export class SigninComponent implements OnInit {
  //formulario reactivo
  authForm!: UntypedFormGroup;
  //control de estado
  submitted = false;
  loading = false;
  returnUrl!: string;
  error = '';
  hide = true; //controla si se oculta o no la contraseña

  email = '';
  password = '';

  constructor(
    private readonly formBuilder: UntypedFormBuilder, //construye el formulario
    private readonly router: Router, //navega entre rutas
    private readonly authService: AuthService, 
  ) {}

  //inicia el componente
  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // Getter para facilitar el acceso a los controles del formulario
  get f() {
    return this.authForm.controls;
  }

  // Método que se ejecuta cuando el usuario envía el formulario
  onSubmit() {
    this.submitted = true; // Marca el formulario como enviado
    this.error = '';       // Limpia errores previos

    // Si el formulario no es válido, muestra un mensaje de error
    if (this.authForm.invalid) {
      Swal.fire('Error', 'Usuario y contraseña no válidos.', 'error');
      return;
    }

    // Llama al método login del servicio de autenticación
    this.authService
      .login(this.authForm.get('username')?.value, this.authForm.get('password')?.value)
      .subscribe({
        // Si la respuesta es exitosa
        next: (res) => {
          if (res?.token) {
            // Guarda el token en sessionStorage
            sessionStorage.setItem('accessToken', res.token);

            // Muestra el token en consola (útil para depuración)
            console.log('Token recibido:', res.token);

            // Guarda el token en el AuthService
            this.authService.setToken(res.token);

            // Muestra alerta de éxito y redirige al dashboard
            Swal.fire({
              title: 'Inicio de sesión exitoso',
              text: 'Redirigiendo al dashboard...',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate(['/dashboard/main']); // Redirige al dashboard
            });
          } else {
            // Si no hay token, muestra error
            Swal.fire('Error', 'Credenciales incorrectas.', 'error');
          }
        },
        // Manejo de errores en la petición
        error: (error) => {
          this.submitted = false;
          this.loading = false;
          Swal.fire('Error en el inicio de sesión', error.error?.message || 'Error desconocido', 'error');
        }
      });
  }
}
