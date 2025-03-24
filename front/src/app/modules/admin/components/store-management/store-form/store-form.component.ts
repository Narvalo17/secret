import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@core/models/store.model';

@Component({
  selector: 'app-store-form',
  templateUrl: './store-form.component.html',
  styleUrls: ['./store-form.component.scss']
})
export class StoreFormComponent implements OnInit {
  @Input() store: Store | null = null;
  @Output() submitForm = new EventEmitter<Partial<Store>>();
  @Output() cancelEdit = new EventEmitter<void>();

  storeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.storeForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      openingHours: ['', [Validators.required]],
      description: [''],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    if (this.store) {
      this.storeForm.patchValue(this.store);
    }
  }

  onSubmit(): void {
    if (this.storeForm.valid) {
      this.submitForm.emit(this.storeForm.value);
    }
  }

  onCancel(): void {
    this.cancelEdit.emit();
  }
} 