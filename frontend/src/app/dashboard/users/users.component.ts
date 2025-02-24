import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import DataTable from 'datatables.net-bs5';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  userForm!: FormGroup;
  editingUser: any = null;
  dataTable!: any;
  modalInstance: any;

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit() {
    this.loadUsers();

    this.userForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      phone_number: ['', [Validators.pattern('^[0-9]{10}$')]],
      role: ['admin'],
      is_auth_pId: [false],
      is_auth_phone_num: [false]
    });

    setTimeout(() => {
      this.dataTable = new DataTable('#usersTable');
    }, 1000);

    this.modalInstance = new bootstrap.Modal(document.getElementById('userModal') as HTMLElement);
  }

  loadUsers() {
    this.http.get<any>('http://127.0.0.1:8000/api/dashboard/users').subscribe(response => {
      this.users = response.users;
    });
  }

  submitForm() {
    const isAuthPId = this.userForm.controls['is_auth_pId'].value === 'true';
    const isAuthPhoneNum = this.userForm.controls['is_auth_phone_num'].value === 'true';

    this.userForm.controls['is_auth_pId'].setValue(isAuthPId);
    this.userForm.controls['is_auth_phone_num'].setValue(isAuthPhoneNum);

    if (this.editingUser) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }


  createUser() {
    if (this.userForm.invalid) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    this.http.post('http://127.0.0.1:8000/api/dashboard/users', this.userForm.value)
      .subscribe({
        next: () => {
          this.loadUsers();
          this.userForm.reset();
          this.editingUser = null;
          this.closeModal();
          window.location.reload();
        },
        error: (err) => {
          alert(err.error.message || 'فشل في إنشاء المستخدم');
        }
      });
  }

  editUser(user: any) {
    this.editingUser = user;
    this.userForm.patchValue({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      username: user.username || '',
      email: user.email || '',
      password: '',
      phone_number: user.phone_number || '',
      role: user.role || 'admin',
      is_auth_pId: Boolean(user.is_auth_pId),
      is_auth_phone_num: Boolean(user.is_auth_phone_num)
    });
    this.openModal();
  }

  updateUser() {
    if (this.userForm.invalid) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const formData = {
      ...this.userForm.value,
      is_auth_phone_num: this.userForm.value.is_auth_phone_num ? 1 : 0,
      is_auth_pId: this.userForm.value.is_auth_pId ? 1 : 0
    };

    if (!formData.password) {
      delete formData.password;
    }

    this.http.put(`http://127.0.0.1:8000/api/dashboard/users/${this.editingUser.id}`, formData)
      .subscribe({
        next: () => {
          this.loadUsers();
          this.userForm.reset();
          this.editingUser = null;
          this.closeModal();
          window.location.reload();

        },
        error: (err) => {
          alert(err.error.message || 'فشل في تحديث المستخدم');
        }
      });
  }

  deleteUser(id: number) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذا المستخدم؟')) {
      this.http.delete(`http://127.0.0.1:8000/api/users/${id}`)
        .subscribe({
          next: () => {
            alert('تم حذف المستخدم بنجاح');
            this.loadUsers();
            window.location.reload();
          },
          error: (err) => {
            alert(err.error.message || 'لا يمكنك حذف مستخدم قبل حذف خدماته');
          }
        });
    }
  }

  openModal() {
    this.modalInstance.show();
  }

  closeModal() {
    this.modalInstance.hide();
  }
}
