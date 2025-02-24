import { CanActivateFn, Router } from "@angular/router";
import { DashboardAuthService } from "../dashboard-auth.service";
import { inject } from "@angular/core";

export const adminGuard: CanActivateFn = (route, state) => {
    const dAuthService = inject(DashboardAuthService);
    const router = inject(Router);
    if (!dAuthService.isLogedin()) {
        router.navigate(['dashboard/login']);
        return false;
    }
    return true;
}