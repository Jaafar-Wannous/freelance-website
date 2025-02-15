import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
    private fb: FormBuilder,
  ){}

  serviceId: any;
  service: any;
  userToken: string;
  userData: any;
  userId: any;
  reviews: any[] = [];
  replies: any[] = [];
  suggestedServices: any[] = []
  review_id: any;
  totalRating: number = 0;
  count: number = 0;
  isOwner = false;
  isReplied: boolean[] = [];
  isReviewed: boolean[] = [];

  reviewsForm: FormGroup;
  replyFronm: FormGroup;

  get f() {
    return this.reviewsForm.controls;
  }

  get fr() {
    return this.replyFronm.controls;
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

    this.serviceId = this.route.snapshot.paramMap.get('id');
    const resolvedData = this.route.snapshot.data['serviceData'];
    this.service = resolvedData.service[0];
    this.images = [...this.service?.images];

    if(this.service.id != this.serviceId) {
      this.relodPage()
    }
    console.log(this.serviceId)
    this.isOwner = this.service?.user_id === this.userId;
    console.log(this.service);

    this.service.category.services.forEach(service => {
      if(service.id !== this.service.id) {
        var rating = 0;
        for(let review of service.review) {
          rating += ((+review.quality_of_service + +review.speed_of_response + +review.communication)/3)
          console.log('re', rating, '\n', service.review.length)
        }
        this.suggestedServices.push({
          ...service,
          avgRating: rating/service.review.length
        })
      }
    });
    console.log('suggest: ',this.suggestedServices, '\n', typeof(this.suggestedServices));

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

    this.replyFronm = this.fb.group({
      reply: new FormControl('', Validators.required),
      review_id: this.review_id,
      user_id: this.userId
    })
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

    this.reviews = this.service.review;
    // this.replies = this.reviews.replies;

    for(let review of this.service.review)  {
      !(review.replies.length) ? this.isReplied[+review.id] = true : this.isReplied[+review.id] = false
      if(review.writer_id === this.userId) {
        this.isReviewed[+review.writer_id] = true;
      }
    }

    console.log(this.reviews)

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

  addReply(reviewId) {
    this.replyFronm.patchValue({review_id: reviewId});
    if(this.replyFronm.valid) {
      const replyData = this.replyFronm.getRawValue();
      const userToken = localStorage.getItem('token');
      if(userToken) {
        this.userToken = userToken
      } else {
        const userToken = sessionStorage.getItem('token');
        this.userToken = userToken
      }

      this.formService.addReply(replyData, this.userToken).
      subscribe(data => {
        console.log(data);
        this.relodPage()
      })
      this.reviewsForm.reset();
    }
  }

  changeServiceId(id: any){
    this.router.navigateByUrl('/services', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/services', id]);
    });
  }

}
