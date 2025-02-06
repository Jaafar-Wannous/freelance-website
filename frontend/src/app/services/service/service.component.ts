import { AfterViewInit, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ShoppingCartService } from 'src/app/shopping-cart/shopping-cart.service';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';
import { FormServiceService } from '../form-service.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements AfterViewInit, OnInit {

  constructor(private route: ActivatedRoute,
    private formService: FormServiceService,
    private router: Router,
    private authService: AuthService,
    private cartService: ShoppingCartService,
    private fb: FormBuilder
  ){}

  serviceId: any;
  service: any;
  userToken: string;
  userData: any;
  userId: any;
  reviews: any[] = [];
  totalRating: number = 0;
  count: number = 0;
  isOwner = false;

  reviewsForm: FormGroup;

  get f() {
    return this.reviewsForm.controls;
  }

  // Start Swiper Configuration

  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  images = [];
  
  index = 0;

  swiperConfig: SwiperOptions = {
    spaceBetween: 10,
    navigation: true,
    loop: true,
    injectStyles: [
      `          
          .swiper-button-next,
          .swiper-button-prev {
            background-color: white !important;
            padding: 8px 16px !important;
            border-radius: 100% !important;
            border: 2px solid black !important;
            color: red !important;
          }
            `
    ]
  }

  ngAfterViewInit() {
    this.swiper.nativeElement.swiper.activeIndex = this.index;
  }

  slideChange(swiper: any) {
    this.index = swiper.detail[0].activeIndex;
  }

  // End Swiper Confeguration

  onDeleteService(id: any) {
    const userToken = localStorage.getItem('token');
    if(userToken) {
      this.userToken = userToken
    }else {
      const userToken = sessionStorage.getItem('token');
      this.userToken = userToken
    }
    this.formService.deleteService(id, userToken).subscribe(
      response => {
        console.log(response);
      }
    );
    this.router.navigate(['/']);
  }

  confirmDeleteService(id: any) {
    const confirmation = confirm('هل أنت متأكد من حذف هذه الخدمة؟')
    if(confirmation) {
      this.onDeleteService(id);
    }
  }

  ngOnInit(): void {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      this.userData = JSON.parse(storedUserData);
      this.userId = this.userData.id
    } else {
      this.authService.userData$.subscribe(userData => {
        this.userId = userData?.id
      });
    }
    
    // this.serviceId = this.route.snapshot.paramMap.get('id');
    const resolvedData = this.route.snapshot.data['serviceData'];
    this.service = resolvedData.service[0];
    this.images = [...this.service?.images];

    this.isOwner = this.service?.user_id === this.userId;
    console.log(this.service);

    // this.formService.getService(this.serviceId).subscribe(
    //   (response: any) => {
    //     this.service = response.service[0];
    //     this.images = [...this.service?.images];
    //     this.isOwner = this.service?.user_id === this.userId;
    //   }
    // );

    this.reviewsForm = this.fb.group({
      comment: new FormControl('', Validators.required),
      quality_of_service: new FormControl('', Validators.required),
      speed_of_response: new FormControl('', Validators.required),
      communication: new FormControl('', Validators.required),
      writer_id: this.userId,
      recipient_id: this.service?.user_id,
      service_id: this.service?.id
    });
    // for(let review of this.service.review){
    //   this.reviews.push(review)
    // }

    // this.formService.getComments().
    // subscribe((data) => {
    //   for(let review of data.reviews){
    //   if(review.service_id === this.service?.id){
    //   this.reviews.push(review)
    //   this.count++
    //   this.totalRating += ((review.quality_of_service + review.speed_of_response + review.communication)/3)
    //   console.log(this.count, this.totalRating);
    // }
    //   }
    //   this.totalRating = this.totalRating/this.count
    //   console.log(this.totalRating)
    // })

    this.reviews = this.service.review

      for(let review of this.service.review){
      this.count++
      this.totalRating += ((review.quality_of_service + review.speed_of_response + review.communication)/3)
      console.log(this.count, this.totalRating);
      }
      this.totalRating = this.totalRating/this.count
      console.log(this.totalRating)

  }

  addToCart(service: any) {
    this.cartService.addToCart(this.userId, service);
    this.router.navigate(['/shopping-cart'])
  }

  addComments() {
    if(this.reviewsForm.valid) {
      const reviewData = this.reviewsForm.getRawValue();
      const userToken = localStorage.getItem('token');
      if (userToken) {
        this.userToken = userToken;
      } else {
        const userToken = sessionStorage.getItem('token');
        this.userToken = userToken
      }
      this.formService.addComments(reviewData, this.userToken).
      subscribe((data) => {
        console.log(data);
        this.relodPage()
      })
      
    }
    this.reviewsForm.reset();
  }

  relodPage() {
    window.location.reload();
  }

}
