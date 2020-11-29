import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProductComponent } from './components/product/product.component';
import { RegisterComponent } from './components/register/register.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { AuthGuard } from './guards/auth-guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: 'cart', component: CartComponent },
  { path: 'thankyou', component: ThankyouComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
