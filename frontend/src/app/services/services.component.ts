import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormServiceService } from './form-service.service';
import { filter } from 'rxjs';

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
  filters = {
    minPrice: null,
    maxPrice: null,
    rating: null,
    duration: '',
  }
  
  constructor(
    private formService: FormServiceService
  ) { }
  

  ngOnInit() {
    this.fetchCategories();
  }
  
  fetchCategories() {
    this.formService.getCategories().subscribe(
      (response) => {
        this.categories = [...response?.categories]
        console.log(this.categories);
    })
  }

  onCategoryChange(categoryId: number) {
    this.selectedCategory = categoryId;
    this.formService.getSubCategories(categoryId).subscribe(
      (response: any) => {
        if(!this.subcategories) {
          this.subcategories = [...response.category[0].categories]
        }else {
          this.subcategories = [];
          this.filteredServices = [];
          this.subcategories = [...response.category[0].categories]
        }
        console.log(this.subcategories);
      }
    )
  }

  // عند الضغط على تصنيف فرعي، جلب الخدمات المرتبطة به
  onSubcategoryClick(categoryId: number) {
    this.formService.getSubCategories(categoryId).subscribe(
      response => {
        this.services = [...response.category[0]?.services];
        console.log(this.filteredServices);
        this.filteredServices = [...this.services];
      }
    )

  }

  // Filters and Search

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

  validInputPrice() {
    if(this.filters.maxPrice < 0) {
      this.filters.maxPrice = null
    }
    if(this.filters.minPrice < 0) {
      this.filters.minPrice = null
    }
  }

applyFilters() {
  this.validInputPrice();
  this.filteredServices = this.services.filter(service => {
    return (
      (!this.filters.minPrice || service.price >= this.filters.minPrice) &&
      (!this.filters.maxPrice || service.price <= this.filters.maxPrice) &&
      // (!this.filters.rating || service.rating >= this.filters.rating) && I have to solve it as duration when the rating was implemented
      (!this.filters.duration || service.duration === this.filters.duration)
    );
  })
}

onDurationChange(event: Event) {
  const selectedDuration =  (event.target as HTMLSelectElement).value
  this.filters.duration = selectedDuration;
  this.applyFilters();
}




}
