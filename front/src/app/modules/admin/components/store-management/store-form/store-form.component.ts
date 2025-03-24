import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@core/models/store.model';

@Component({
  selector: 'app-store-form',
  templateUrl: './store-form.component.html',
  styleUrls: ['./store-form.component.scss']
})
export class StoreFormComponent implements OnInit {
  @Input() store: Store | null = null;
  @Output() submitStore = new EventEmitter<Store>();
  @Output() cancelForm = new EventEmitter<void>();

  storeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.storeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s-]{10,}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    if (this.store) {
      this.storeForm.patchValue({
        name: this.store.name,
        description: this.store.description,
        address: this.store.address,
        phone: this.store.phone,
        email: this.store.email
      });
    }
  }

  onSubmit(): void {
    if (this.storeForm.valid) {
      const formData = this.storeForm.value;
      const store: Store = {
        ...formData,
        id: this.store?.id
      };
      this.submitStore.emit(store);
      this.storeForm.reset();
    }
  }

  onCancel(): void {
    this.cancelForm.emit();
    this.storeForm.reset();
  }
} 