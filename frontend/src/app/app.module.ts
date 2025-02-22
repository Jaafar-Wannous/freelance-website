import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FilePondModule } from 'ngx-filepond';


import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AddServiceComponent } from './services/add-service/add-service.component';
import { ServicesComponent } from './services/services.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FooterComponent } from './footer/footer.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { NotificationsComponent } from './notifications/notifications.component';

import * as filePond from 'filepond';
import * as FilePondPlugingFileEncode from 'filepond-plugin-file-encode';
import * as FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import * as FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import * as FilePondPlugingImageValidateSize from 'filepond-plugin-image-validate-size';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { ServiceComponent } from './services/service/service.component';
import { SwiperDirective } from './directives/swiper.directive';
import { EditServiceComponent } from './services/edit-service/edit-service.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { ChatComponent } from './components/chat/chat.component';
import { RequestsComponent } from './requests/requests.component';
import { RequestComponent } from './requests/request/request.component';
import { PurchasesComponent } from './purchases/purchases.component';
import { PurchasComponent } from './purchases/purchas/purchas.component';
import { register } from 'swiper/element';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './dashboard/users/users.component';
import { CategoriesComponent } from './dashboard/categories/categories.component';
import { DdServiceComponent } from './dashboard/dd-service/dd-service.component';
import { SidebarComponent } from './dashboard/sidebar/sidebar.component';
import { NavbarComponent } from './dashboard/navbar/navbar.component';

filePond.registerPlugin(FilePondPluginFileValidateType);
filePond.registerPlugin(FilePondPluginFileValidateSize);
filePond.registerPlugin(FilePondPlugingImageValidateSize);
filePond.registerPlugin(FilePondPlugingFileEncode);
register();


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    ServicesComponent,
    RegisterComponent,
    LoginComponent,
    UserProfileComponent,
    AddServiceComponent,
    StarRatingComponent,
    VerifyEmailComponent,
    ServiceComponent,
    SwiperDirective,
    EditServiceComponent,
    ShoppingCartComponent,
    TimeAgoPipe,
    FooterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    NotificationsComponent,
    ChatComponent,
    RequestsComponent,
    RequestComponent,
    PurchasesComponent,
    PurchasComponent,
    DashboardComponent,
    UsersComponent,
    CategoriesComponent,
    RequestsComponent,
    DdServiceComponent,
    SidebarComponent,
    NavbarComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FilePondModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
