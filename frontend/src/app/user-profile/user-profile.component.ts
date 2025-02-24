import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UserProfileService } from './user-profile.service';
import { NotificationService } from '../notifications/notification.service';
import { DashboardRequestService } from '../dashboard/dd-request/drequest.service';
import { FilePondOptions } from 'filepond';
import { FilePondComponent } from 'ngx-filepond';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var bootstrap: any; // استخدم Bootstrap لإظهار وإخفاء المودال

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  role: string = '';
  userData: any;
  jobTitle: string = '';
  aboutMe: string = '';
  phoneNumber: string = '';
  phoneVerificationStatus: string = '';
  maxChars: number = 1000;
  remainingChars: number = this.maxChars;
  tempImage: string | null = null;
  services: any[] = [];

  imageForm: FormGroup

  get f() {
    return this.imageForm.controls
  }

    get images(): FormArray {
      return this.imageForm.get('images') as FormArray;
    }

  constructor(private authService: AuthService,
    private userProfileService: UserProfileService,
    private notificationService: NotificationService,
    private dRequest: DashboardRequestService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      this.userData = JSON.parse(storedUserData);
      this.userData.last_seen = new Date().toISOString();
      this.role = this.userData.role;
    } else {
      this.authService.userData$.subscribe(userData => {
        this.userData = userData;
        this.role = userData?.role || '';
      });
    }

    if (this.userData.role === 'seller') {
      this.fetchServices(this.userData.id);
    }

    this.imageForm = this.fb.group({
      images: new  FormArray([], Validators.required)
    })
  }

  //Start filePond confeguration

  @ViewChild('myPond') myPond: FilePondComponent;

  pondOptions: FilePondOptions = {
    allowMultiple: true,
    labelIdle: `<div class="filepond--label-action">أضف صور</div>`,
    allowFileSizeValidation: true,
    maxFileSize: '5MB',
    labelMaxFileSizeExceeded: 'الملف أكبر من الحد المسموح (5 ميجابايت)',
    maxFiles: 2,
    acceptedFileTypes: ['image/*'],
    labelFileTypeNotAllowed: 'الملف غير مسموح. يجب أن يكون نوع الملف صورة.',
    allowImageValidateSize: true,
    imageValidateSizeMaxHeight: 470,
    imageValidateSizeMaxWidth: 800,
    imageValidateSizeLabelImageSizeTooBig: 'يجب أن تكون الأبعاد أقل من 800×470 بكسل',
  }

  pondFiles: FilePondOptions["files"] = [];

  pondHandleAddFile(event: any) {
    //  Start Images Validators
    const fileSize = event.file.file.size;
    const fileDimensions = event.error?.sub;

    if (fileSize > 5*1024*1024) {  // for size
      return;
    }

    if (fileDimensions === "Maximum size is 800 × 470") { //for dimensions
      return;
    }
    // End Images Validators

    if (event && event.file) {
      const base64String = event.file.getFileEncodeBase64String();
      const mimeType = event.file.fileType;
      const dataUrl = `data:${mimeType};base64,${base64String}`;

      // Add Base64 image to FormArray
      this.images.push(this.fb.control(dataUrl));
    }
  }

  pondHandleFileRemove(event: any) {
  // Clear the image data when the file is removed
  const base64String = event.file.getFileEncodeBase64String();
  const mimeType = event.file.fileType;
  const dataUrl = `data:${mimeType};base64,${base64String}`;

  if (event && event.file) {
    // Find the index of the removed image and remove it from the FormArray
    const index = this.images.value.findIndex(image => image.value === dataUrl);
    if (index === -1) {
      this.images.removeAt(index);
    }
    console.log(this.images)
  }
}

  // End filePond confeguratin

  fetchServices(userId: number): void {
    this.userProfileService.getServices(userId).subscribe(
      (response: any) => {
        if (response.success) {
          this.services = response.services; // تحديث قائمة الخدمات
        }
      },
      (error: any) => {
        console.error('خطأ أثناء جلب الخدمات:', error);
      }
    );
  }

  updateRole(role: string) {
    const userId = this.userData.id;
    this.userProfileService.updateRole(userId, role).subscribe({
      next: () => {
        this.userData.role = role;
        localStorage.setItem('userData', JSON.stringify(this.userData));
          window.location.reload();
      }
    });
  }

  updateRemainingChars() {
    this.remainingChars = this.maxChars - (this.aboutMe?.length || 0);
  }

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.tempImage = reader.result as string;
          this.userData.image = this.tempImage;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  saveImage(): void {
    if (!this.userData.image) {
      console.error('No image to save');
      return;
    }

    const payload = {
      image: this.userData.image
    };

    this.userProfileService.updateUserImage(this.userData.id, payload).subscribe({
      next: (response) => {
        this.userData.image = response.image_url;
        localStorage.setItem('userData', JSON.stringify(this.userData));
        const modal = document.getElementById('editImageModal');
        const bootstrapModal = bootstrap.Modal.getInstance(modal);
        bootstrapModal?.hide();
        window.location.reload();
      }
    }
    );
  }

  deleteImage(): void {
    this.userProfileService.deleteUserImage(this.userData.id).subscribe({
      next: () => {
        this.userData.image = '';
        localStorage.setItem('userData', JSON.stringify(this.userData));
        const modal = document.getElementById('editImageModal');
        const bootstrapModal = bootstrap.Modal.getInstance(modal);
        bootstrapModal?.hide();
        window.location.reload();
      }
    });
  }

  submitJobTitle(): void {
    this.userProfileService.updateJobTitle(this.userData.id, this.jobTitle).subscribe({
      next: () => {
        this.userData.job_title = this.jobTitle;
        localStorage.setItem('userData', JSON.stringify(this.userData));
        const modal = document.getElementById('jobTitleModal');
        const bootstrapModal = bootstrap.Modal.getInstance(modal);
        bootstrapModal?.hide();
      },
      error: (error) => {
        console.error('Failed to update job title:', error);
      }
    }
    );
  }


  submitAboutMe(): void {
    this.userProfileService.updateAboutMe(this.userData.id, this.aboutMe).subscribe({
      next: () => {
        this.userData.about_me = this.aboutMe;
        localStorage.setItem('userData', JSON.stringify(this.userData));
        const modal = document.getElementById('aboutMeModal');
        const bootstrapModal = bootstrap.Modal.getInstance(modal);
        bootstrapModal?.hide();
      },
      error: (error) => {
        console.error('Failed to update job title:', error);
      }
    }
    );
  }

  isExpanded: boolean = false;

  deleteJobTitle(): void {
    this.userProfileService.deleteJobTitle(this.userData.id).subscribe(
      (response) => {
        this.userData.job_title = null;
        localStorage.setItem('userData', JSON.stringify(this.userData));
      },
      (error) => {
        console.error('Failed to delete job title:', error);
      }
    );
  }

  confirmDeleteJobTitle(): void {
    const confirmation = confirm('هل أنت متأكد من أنك تريد حذف المسمى الوظيفي؟');
    if (confirmation) {
      this.deleteJobTitle();
    }
  }

  submitPhoneVerification(): void {
    // this.userProfileService.verifyPhone(this.userData.id, this.phoneNumber).subscribe({
    //   next: () => {
    //     this.userData.phone_number = this.phoneNumber;
    //     localStorage.setItem('userData', JSON.stringify(this.userData));
    //     this.phoneVerificationStatus = 'رقم الجوال قيد المراجعة';
    //     const modal = bootstrap.Modal.getInstance(document.getElementById('phoneVerificationModal'));
    //     modal?.hide();
    //     this.notificationService.sendNotification(1, 'توثيق رقم الهاتف', `يرغب المستخدم ${this.userData.username} بتوثيق حسابه باستخدام رقم الهاتف`, {'phoneNumber': this.phoneNumber}).subscribe(() => alert('تم ارسال طلبك الى المشرفين و سيتم اخبارك بالنتيجة'))
    //   },
    //   error: (error) => {
    //     console.error('Failed to submit phone verification:', error);
    //   }
    // }

    // );

    this.dRequest.makeRequest({'type': 'توثيق رقم الهاتف', 'data': [this.phoneNumber]}).subscribe(() => alert('تم إرسال طلبك إلى المشرفين وسيتم إاعلامك بالنتيجة'));
  }

  submitPhotoIdVerification() {
    if(this.imageForm.valid){
      const imageData = this.imageForm.getRawValue();
      this.dRequest.makeRequest({'type': 'توثيق هوية', 'data': imageData}).subscribe(() => alert('تم إرسال طلبك إلى المشرفين وسيتم إاعلامك بالنتيجة'));
    }
  }

  toggleAboutMe(): void {
    this.isExpanded = !this.isExpanded;
  }

  getLastSeenText(lastSeen: string): string {
    const lastSeenDate = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = (now.getTime() - lastSeenDate.getTime()) / (1000 * 60);
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;

    if (diffInMinutes < 1) {
      return 'الآن';
    } else if (diffInHours < 24) {
      return `منذ ${Math.floor(diffInHours)} ساعة`;
    } else if (diffInDays < 2) {
      return 'منذ يوم';
    } else if (diffInDays < 3) {
      return 'منذ يومين';
    } else {
      return lastSeenDate.toLocaleDateString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit' });
    }
  }
}
