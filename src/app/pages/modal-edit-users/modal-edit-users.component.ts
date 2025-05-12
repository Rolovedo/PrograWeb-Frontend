import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'app/services/users/users.service';

@Component({
  selector: 'app-modal-edit-users',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatSelectModule, MatIconModule, MatFormFieldModule,
            MatInputModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, ReactiveFormsModule],
  templateUrl: './modal-edit-users.component.html',
  styleUrls: ['./modal-edit-users.component.scss']
})
export class ModalEditUsersComponent {
  //Nos permite hacer uso del formulario reactivo
  formUpdateUsers!: FormGroup;
  //Presenta el mismo formulario que tenia anteriormente para editarlo
  administratorsValues: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly _formBuilder: FormBuilder, //Permite construir el formulario reactivo
    private readonly _snackBar: MatSnackBar, //Muestra los mensajes emergentes
    private readonly _userService: UserService, //Invocamos el servicio que necesitamos para editar los usuairos
    private readonly dialogRef: MatDialogRef<ModalEditUsersComponent> //Cierra el modal
  ) {
    this.updateFormUsers(); //Inicia y crea el fomulario vacio para los administradores
    this.getAllAdministrator();
  }

  //Verifica si el usuario tiene datos almacenados para cargarlos
  ngOnInit() {
    if (this.data?.user) {
      this.loadUserData(this.data.user);
    }
  }

  //Carga el formulario reactivo con los campos que creamos en el create-user
  updateFormUsers() {
    this.formUpdateUsers = this._formBuilder.group({
      nombre: ['', Validators.required], //validator.required hace la validacion para cada uno de los campos ya que son obligatorios
      email: ['', [Validators.required, Validators.email]], //valida el formato valido para el email
      rol_id: ['', Validators.required],
      administrador_id: ['', Validators.required]
    });
  }
  
  //Carga los datos de un usuario existente en el formulario reactivo
  loadUserData(user: any) {
    this.formUpdateUsers.patchValue({ //Asigna los valores validados al campo de cada uno
      nombre: user.nombre,
      email: user.email,
      rol_id: String(user.rol_id), //Pasa el rol_id a tipo string
      administrador_id: user.administrador_id
    });
  }

  //consulta del userService para mostrar los administradores
  getAllAdministrator() {
    this._userService.getAllAdministrator().subscribe({
      next: (res) => {
        this.administratorsValues = res.users; //Guarda los administradores consultados para listarlos
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  
  //Se activa al seleccionar la edicion del usuario
  updateUsers() {
    if (this.formUpdateUsers.valid) { //Valida los campos de los usuarios
      const userData = this.formUpdateUsers.value;
      const userId = this.data?.user?.id; //Pasa el id del usuario para poder confirmar la edicion de este
      
      //Llama el userService pasandole el userId y el userData (Datos nuevos)
      this._userService.updateUser(userId, userData).subscribe({
        //Si es exitoso
        next: (response) => {
          this._snackBar.open(response.message, 'Cerrar', { duration: 5000 }); //Notifica el mensaje de respuesta correcto
          this.dialogRef.close(true); //Cierra el modal
        },
        //En caso de error
        error: (error) => {
          //Muestra mensaje personalizado sobre el error
          const errorMessage = error.error?.result || 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
          //Notifica el mensaje de respuesta erronea
          this._snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
        }
      });
    }
  }
}