import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { ServiceService } from '../services/service.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  categories: any[] = [];
  subcategories: any[] = [];
  services: any[] = [];
  selectedCategory: any = null;
  filteredServices: any[] = []; // قائمة قابلة للتصفية من الخدمات

  constructor(
    private categoryService: CategoryService,
    private serviceService: ServiceService
  ) { }

  ngOnInit() {
    this.fetchMainCategories();
  }

  fetchMainCategories() {
    this.categoryService.getMainCategories().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.categories = response.categories;
        }
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  onMainCategoryClick(category: any) {
    // إذا كان التصنيف النشط هو نفسه التصنيف الذي تم الضغط عليه، نقوم بإلغاء تفعيله
    if (this.selectedCategory === category) {
      this.selectedCategory = null; // إلغاء تفعيل التصنيف النشط
      this.subcategories = []; // إفراغ التصنيفات الفرعية عند إلغاء التحديد
      this.services = []; // مسح الخدمات عند التبديل لتصنيف رئيسي جديد
      this.filteredServices = [];
    } else {
      this.selectedCategory = category; // تعيين التصنيف الجديد كتصنيف نشط
      this.subcategories = category.categories; // استرجاع التصنيفات الفرعية
      this.services = []; // مسح الخدمات القديمة
      this.filteredServices = [];
    }
  }

  // عند الضغط على تصنيف فرعي، جلب الخدمات المرتبطة به
  onSubcategoryClick(subcategory: any) {
    this.serviceService.getServicesByCategory(subcategory.id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.services = response.services;
          this.filteredServices = [...this.services]; // تحديث القائمة القابلة للتصفية
          console.log(this.services);
        }
      },
      error: (error) => {
        console.error('Error fetching services:', error);
      }
    });
  }



  search(query: string): void {
    this.filteredServices = this.services.filter(service =>
      service.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  sortBy(criteria: string): void {
    this.filteredServices.sort((a, b) => {
      if (criteria === 'rating') {
        return (b.rating || 0) - (a.rating || 0); // التعامل مع التقييم غير الموجود
      } else if (criteria === 'price-asc') {
        return (a.price || 0) - (b.price || 0); // السعر تصاعديًا
      } else if (criteria === 'price-desc') {
        return (b.price || 0) - (a.price || 0); // السعر تنازليًا
      } else if (criteria === 'duration') {
        return (a.duration || 0) - (b.duration || 0); // المدة
      }
      return 0;
    });
  }


}
