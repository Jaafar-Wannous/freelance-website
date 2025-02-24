import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AddServiceComponent } from './services/add-service/add-service.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { authGuard, guestGuard } from './guards/auth-guards';
import { serviceResolver } from './services/service/service.resolver';
import { ServiceComponent } from './services/service/service.component';
import { editService } from './guards/service.guard';
import { EditServiceComponent } from './services/edit-service/edit-service.component';
import { ServicesComponent } from './services/services.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ChatComponent } from './components/chat/chat.component';
import { PurchasComponent } from './purchases/purchas/purchas.component';
import { PurchasesComponent } from './purchases/purchases.component';
import { requestResolver } from './requests/request.resolver';
import { RequestComponent } from './requests/request/request.component';
import { RequestsComponent } from './requests/requests.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './dashboard/users/users.component';
import { DdServiceComponent } from './dashboard/dd-service/dd-service.component';
import { CategoriesComponent } from './dashboard/categories/categories.component';
import { DdRequestComponent } from './dashboard/dd-request/dd-request.component';
import { DashboardAuthComponent } from './dashboard/dashboard-auth/dashboard-auth.component';
import { adminGuard } from './dashboard/dashboard-auth/dashboard-guard/dashboard-auth.guard';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'verify-email', component: VerifyEmailComponent, canActivate: [guestGuard] },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [guestGuard] },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [guestGuard] },
  { path: 'services/:id', component: ServiceComponent, resolve: {serviceData: serviceResolver} },
  { path: 'profile', component: UserProfileComponent, canActivate: [authGuard] },
  { path: 'add-service', component: AddServiceComponent, canActivate: [authGuard] },
  { path: 'edit-service/:id', component: EditServiceComponent, canActivate: [editService]},
  { path: 'services', component: ServicesComponent},
  { path: 'chat', component: ChatComponent},
  { path: 'shopping-cart', component: ShoppingCartComponent},
  { path: 'notifications', component: NotificationsComponent},
  { path: 'requests', component: RequestsComponent},
  { path: 'requests/:id', component: RequestComponent, resolve: {requestData: requestResolver}},
  { path: 'purchases', component: PurchasesComponent},
  { path: 'purchases/:id', component: PurchasComponent, resolve: {requestData: requestResolver}},

  {path: 'dashboard',component: DashboardComponent, canActivate: [adminGuard]},
  { path: 'dashboard/users', component: UsersComponent, canActivate: [adminGuard] },
  { path: 'dashboard/services', component: DdServiceComponent, canActivate: [adminGuard] },
  { path: 'dashboard/categories', component: CategoriesComponent, canActivate: [adminGuard] },
  { path: 'dashboard/requests', component: DdRequestComponent, canActivate: [adminGuard] },
  { path: 'dashboard/login', component: DashboardAuthComponent },


  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
