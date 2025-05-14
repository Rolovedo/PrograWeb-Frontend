import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators, ReactiveFormsModule, FormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogActions } from '@angular/material/dialog';
import { MatDialogTitle } from '@angular/material/dialog';
import { MatDialogContent } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
// Importación corregida del servicio de usuario
import { UserService } from '../../services/users/users.service';
// Importa SweetAlert
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-create-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
  ],
  templateUrl: './modal-create-user.component.html',
  styleUrls: ['./modal-create-user.component.scss']
})
export class ModalCreateUserComponent implements OnInit {
  formCreateUser!: FormGroup;
  administratorValues: any[] = [];
  showFieldAdministrator: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly _formBuilder: FormBuilder,
    private readonly _userService: UserService,
    private readonly dialogRef: MatDialogRef<ModalCreateUserComponent>,
    private readonly _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.createFormUsers();
    this.getAllAdministrator();

    this.formCreateUser.controls['confirmPassword'].valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((value) => {
      this.validatePassword(value);
    });
  }

  createFormUsers(): void {
    this.formCreateUser = this._formBuilder.group({
      nombre: [''],
      email: [''],
      password: [''],
      confirmPassword: [''],
      rol_id: [''],
      administrador_id: ['']
    });
  }

  getAllAdministrator() {
    this._userService.getAllAdministrator().subscribe({
      next: (res) => {
        this.administratorValues = res.users;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  
  onChangeRole(event: any) {
    if (event.value === '1') {
      this.hideAdministratorField();
    } else {
      this.showAdministratorField();
    }
  }
  
  onSubmit() {
    //siempre se debe hacer esta validacion
    if (this.formCreateUser.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos', 'error');
      return;
    }
  
    const userDataInformation = {
      nombre: this.formCreateUser.get('nombre')?.value,
      email: this.formCreateUser.get('email')?.value,
      password: this.formCreateUser.get('password')?.value,
      //se  inicializa con number para no correr el riesgo de que entregue una string
      rol_id: Number(this.formCreateUser.get('rol_id')?.value),
      administrador_id: this.formCreateUser.get('administrador_id')?.value
    };
  
    //respuestas del servidor hacia la informacion si fue enviada correcta o si hubo un error
    this._userService.createUser(userDataInformation).subscribe({
      next: (response) => {
        this._snackBar.open(response.message, 'Cerrar', { duration: 5000 });
        //limpia el formulario despues de las peticiones
        this.formCreateUser.reset();
        //cierra los modales
        this.dialogRef.close(true);
      },
      //caso de error si existe al crear el usuario
      error: (error) => {
        const errorMessage = error.error?.result || 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
        this._snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
      }
    });
  }

  private validatePassword(confirmPassword: string) { // Contraseña de confirmación coincide con la contraseña
    const password = this.formCreateUser.get('password')?.value;
    if (password !== confirmPassword) {
      this.formCreateUser.get('confirmPassword')?.setErrors({ invalid: true });
    } else {
      this.formCreateUser.get('confirmPassword')?.setErrors(null); // Si coincide, no hay error
    }
  }
  
  private showAdministratorField() { // Cuando el rol es diferente de 1, se muestra el campo de administrador
    this.showFieldAdministrator = true;
    this.formCreateUser.get('administrator_id')?.setValidators([Validators.required]);
    this.formCreateUser.get('administrator_id')?.updateValueAndValidity();
  }
  
  private hideAdministratorField() { // Cuando el rol es 1, no se muestra el campo de administrador / no es requerido
    this.showFieldAdministrator = false;
    this.formCreateUser.get('administrator_id')?.clearValidators();
    this.formCreateUser.get('administrator_id')?.updateValueAndValidity();
  }
}