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
// Importación del servicio de proyectos
import { ProjectService } from '../../services/projects/projects.service';
// Importa SweetAlert
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-create-project',
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
  templateUrl: './modal-create-project.component.html',
  styleUrls: ['./modal-create-project.component.scss']
})
export class ModalCreateProjectComponent implements OnInit {
  formCreateProject!: FormGroup;
  categoryValues: any[] = [];
  clientValues: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly _formBuilder: FormBuilder,
    private readonly _projectService: ProjectService,
    private readonly dialogRef: MatDialogRef<ModalCreateProjectComponent>,
    private readonly _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.createFormProject();
    this.getAllCategories();
    this.getAllClients();
  }

  createFormProject(): void {
    this.formCreateProject = this._formBuilder.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      fecha_inicio: ['', [Validators.required]],
      fecha_fin: ['', [Validators.required]],
      presupuesto: ['', [Validators.required, Validators.min(0)]],
      estado: ['', [Validators.required]],
      categoria_id: ['', [Validators.required]],
      cliente_id: ['', [Validators.required]]
    });
  }

  getAllCategories() {
    this._projectService.getAllCategories().subscribe({
      next: (res) => {
        this.categoryValues = res.categories;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getAllClients() {
    this._projectService.getAllClients().subscribe({
      next: (res) => {
        this.clientValues = res.clients;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  
  onSubmit() {
    if (this.formCreateProject.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos', 'error');
      return;
    }
  
    const projectDataInformation = {
      nombre: this.formCreateProject.get('nombre')?.value,
      descripcion: this.formCreateProject.get('descripcion')?.value,
      fecha_inicio: this.formCreateProject.get('fecha_inicio')?.value,
      fecha_fin: this.formCreateProject.get('fecha_fin')?.value,
      presupuesto: Number(this.formCreateProject.get('presupuesto')?.value),
      estado: this.formCreateProject.get('estado')?.value,
      categoria_id: Number(this.formCreateProject.get('categoria_id')?.value),
      cliente_id: Number(this.formCreateProject.get('cliente_id')?.value)
    };
  
    this._projectService.createProject(projectDataInformation).subscribe({
      next: (response) => {
        this._snackBar.open(response.message, 'Cerrar', { duration: 5000 });
        this.formCreateProject.reset();
        this.dialogRef.close(true);
      },
      error: (error) => {
        const errorMessage = error.error?.result || 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
        this._snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
      }
    });
  }

  validateDates() {
    const fechaInicio = new Date(this.formCreateProject.get('fecha_inicio')?.value);
    const fechaFin = new Date(this.formCreateProject.get('fecha_fin')?.value);
    
    if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
      this.formCreateProject.get('fecha_fin')?.setErrors({ invalidDateRange: true });
    } else {
      // Si no hay error en las fechas, verificamos si hay otros errores
      const currentErrors = this.formCreateProject.get('fecha_fin')?.errors;
      if (currentErrors) {
        delete currentErrors['invalidDateRange'];
        // Si no quedan errores, establecemos null
        this.formCreateProject.get('fecha_fin')?.setErrors(
          Object.keys(currentErrors).length ? currentErrors : null
        );
      }
    }
  }
}