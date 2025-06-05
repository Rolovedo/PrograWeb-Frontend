import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
export interface User {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  name: string;
}

@Component({
  selector: 'app-modal-assign-users-projects',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modal-assign-users-projects.component.html',
  styleUrl: './modal-assign-users-projects.component.scss'
})
export class ModalAssignUsersProjectsComponent implements OnInit {
  @Input() users: User[] = [];
  @Input() projects: Project[] = [];
  @Output() assign = new EventEmitter<{ userId: number; projectId: number }>();
  @Output() close = new EventEmitter<void>();

  assignForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.assignForm = this.fb.group({
      userId: [null, Validators.required],
      projectId: [null, Validators.required]
    });
  }

  onAssign(): void {
    if (this.assignForm.valid) {
      this.assign.emit(this.assignForm.value);
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
