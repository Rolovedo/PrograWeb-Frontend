import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from 'app/shared/components/breadcrumb/breadcrumb.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from 'app/services/users/users.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalCreateUserComponent } from 'app/pages/modal-create-user/modal-create-user.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalEditUsersComponent } from 'app/pages/modal-edit-users/modal-edit-users.component';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';


export interface User {
  name: string;
}


@Component({
    selector: 'app-users',
    standalone: true,
    imports: [
      CommonModule,
      BreadcrumbComponent,
      MatFormFieldModule,
      MatSelectModule,
      MatOptionModule,
      MatDatepickerModule,
      MatInputModule,
      MatTooltipModule,
      ReactiveFormsModule,
      MatSnackBarModule,
      MatAutocompleteModule,
      MatIconModule,
      MatPaginatorModule,
      MatButtonModule,
      MatTableModule,
      MatProgressSpinnerModule
    ],
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
  })
  export class UsersComponent {
  
    displayedColumns: string[] = [
      'name',
      'email',
      'role',
      'action'
    ];
  
    breadscrums = [
      {
        title: 'Gestión de usuarios',
        items: [],
        active: 'Datos básicos'
      },
    ];

    trackByFn(index: number, item: any): any {
      return item?.id || index;
    }

    breadcrumsDetails = [
        {
          title: '',
        },
      ];
      
      //Tabla
      dataSource = new MatTableDataSource<any>([]);
      @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
      
      //Buscador
      userFormSearchFilter!: FormGroup; //Variable que define un formulario reactivo (filtros)
      usersList: any[] = []; //Variable global de lista de usuarios
      
      isLoading = false; //Se inicializa como falso al empezar
      
      //Valores iniciales de los filtros son indfeinidos
      userDefaultFilterSearch: any = {
        name: undefined,
        email: undefined,
      }
      
      constructor(
        private readonly _formBuilder: FormBuilder, //Crea formularios
        private readonly userService: UserService, //usar el servicio de usuarios
        private readonly analytics: Analytics,
        private readonly _snackBar: MatSnackBar,
        private readonly dialogModel: MatDialog
      ) { }

      //inicializa el componente
      ngOnInit(): void {
        this.createUserFormSearchFilter(); //metodo de busqueda
        this.getAllUserByAdministrator(); //metodo publico de administradores
        this.handleUserFilterChange('name', 'name'); //filtros opcionales del nombre y email
        this.handleUserFilterChange('email', 'email');
      }

      private createUserFormSearchFilter() {
        this.userFormSearchFilter = this._formBuilder.group({
          name: [''],
          email: ['']
        });
      }
      
      //Obtiene el rol de los usuarios 1 administrador y 2 usuario
      getRoleName(rol_id: number): string {
        //usa la estructura del switch para evaluar el valor y retorne el nombre, no el rol_id
        switch (rol_id) {
          case 1:
            return 'Administrador';
          case 2:
            return 'Usuario';
          default:
            return 'Desconocido';
        }
      }
      
      //tiene una llave de filtro para la busqueda
      private handleUserFilterChange(controlName: string, filterKey: string) {
        this.userFormSearchFilter.controls[controlName].valueChanges.pipe(
          debounceTime(500), //tiempo de espera sin cambios antes de emitir cualquier valor
          distinctUntilChanged() //emite el valor si es diferente al anterior
        ).subscribe((value: any) => {
          //nuevo valor de la nueva busqueda
          this.userDefaultFilterSearch[filterKey] = value;
          console.log(this.userDefaultFilterSearch);
          //carga los usuarios que se necesitan para la busqueda del filtro
          this.getAllUserByAdministrator({ 
            ...this.userDefaultFilterSearch, 
            [filterKey]: value 
          });
        });
      }
      

      getAllUserByAdministrator(filters?: any): void {
        this.isLoading = true;
        //Le damos la posibilidad de tener filtros de busqueda
        this.userService.getAllUsersByAdministrator(filters).subscribe({
            //Recibe los datos cuando esten disponibles
          next: (response) => {
            this.usersList = response.users;
            this.dataSource.data = response.users;
            this.dataSource.paginator = this.paginator;
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
          }
        });
      }

      //los usamos para cuando se abran los modales al crear los usuarios
      openModalCreateUser(): void {
        //guarda la referencia del modal en dialogref
        const dialogRef = this.dialogModel.open(ModalCreateUserComponent, {
          minWidth: '300px', //ancho minimo
          maxWidth: '1000px', //ancho maximo
          width: '840px', //ancho inicial fijo
          disableClose: true, //no permite cerrar el modal haciendo click afuera de el o esc (debe completar el modal)
        });
      
        //se subscribe para ejecutar una funcion al cerrar el modal
        dialogRef.afterClosed().subscribe(result => {
          //si todo sale de manera exitosa se crea el usuario
          if (result) {
            this.getAllUserByAdministrator();
          }
        });
      }

      //madal que actualiza los usuarios
      openModalUpdateUsers(userInformation: any): void {
        const dialogRef = this.dialogModel.open(ModalEditUsersComponent, {
          minWidth: '300px',
          maxWidth: '1000px',
          width: '840px',
          disableClose: true,
          data: userInformation
        });
      
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.getAllUserByAdministrator();
          }
        });
      }

      //borra un usuario
      deleteUser(userId: number): void {
        //llama al metodo dentro del userService que elimina el usuario dandole el id
        this.userService.deleteUser(userId).subscribe({
          //despues de elminar al usuario enviara un mensaje
          next: (response) => {
            //snackBar viene de angular material como mensaje de respuesta
            this._snackBar.open(response.message, 'Cerrar', { duration: 5000 });
            this.getAllUserByAdministrator();
          },
          //parametrizamos un caso de error
          error: (error) => {
            const errorMessage = error.error?.message || 'Error al eliminar el usuario';
            this._snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
          }
        });
      }
      
      
      
  }