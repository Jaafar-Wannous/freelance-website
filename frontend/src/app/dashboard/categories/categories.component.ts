import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { main } from '@popperjs/core';
import * as bootstrap from 'bootstrap';
import DataTable from 'datatables.net-bs5';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  mainCategories : any[] = [];
  categoryForm!: FormGroup;
  editingCategory: any = null;
  dataTable!: any;
  modalInstance: any;
  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit() {
    this.loadCategories();

    this.categoryForm = this.fb.group({
      title: ['', Validators.required],
      image: [''],
      mainCategory: ['']
    });

    setTimeout(() => {
      this.dataTable = new DataTable('#categoriesTable');
    }, 1000);

    this.modalInstance = new bootstrap.Modal(document.getElementById('categoryModal') as HTMLElement);
  }

  loadCategories() {
    this.http.get<any>('http://127.0.0.1:8000/api/dashboard/categories').subscribe(response => {
      this.categories = response.categories; // تعيين جميع التصنيفات
      // تصفية التصنيفات الرئيسية فقط بعد تحميل البيانات
      this.mainCategories = this.categories.filter((cat: any) => cat.mainCategory == null);
    });
  }


  getMainCategoryName(mainCategoryId: number): string {
    const mainCategory = this.categories.find(cat => cat.id === mainCategoryId);
    return mainCategory ? mainCategory.title : 'غير محدد';
  }

  submitForm() {
    if (this.editingCategory) {
      this.updateCategory();
    } else {
      this.createCategory();
    }
  }

  createCategory() {
    this.http.post('http://127.0.0.1:8000/api/categories', this.categoryForm.value)
      .subscribe(() => {
        this.loadCategories();
        this.categoryForm.reset();
        this.editingCategory = null;
        this.closeModal();
        window.location.reload();
      });
  }

  editCategory(category: any) {
    this.editingCategory = category;
    this.categoryForm.patchValue(category);
    this.openModal();
  }

  updateCategory() {
    this.http.put(`http://127.0.0.1:8000/api/categories/${this.editingCategory.id}`, this.categoryForm.value)
      .subscribe(() => {
        this.loadCategories();
        this.categoryForm.reset();
        this.editingCategory = null;
        this.closeModal();
        window.location.reload();
      });
  }

  // deleteCategory(id: number) {
  //   if (confirm('هل أنت متأكد أنك تريد حذف هذه الفئة؟')) {
  //     this.http.delete(`http://127.0.0.1:8000/api/categories/${id}`)
  //       .subscribe(() => {
  //         this.loadCategories();
  //         window.location.reload();
  //       });
  //   }
  // }

  deleteCategory(id: number) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذه الفئة؟')) {
      this.http.delete(`http://127.0.0.1:8000/api/categories/${id}`)
        .subscribe({
          next: () => {
            alert('تم حذف المستخدم بنجاح');
            this.loadCategories();
          },
          error: (err) => {
            alert(err.error.message || 'حدث خطأ أثناء الحذف');
          }
        });
    }
  }

  // ✅ فتح المودال باستخدام Bootstrap API
  openModal() {
    this.modalInstance.show();
  }

  // ✅ إغلاق المودال باستخدام Bootstrap API
  closeModal() {
    this.modalInstance.hide();
  }
}
