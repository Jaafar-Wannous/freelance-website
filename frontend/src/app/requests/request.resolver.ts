import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { RequestService } from "./request.service";
import { Observable } from "rxjs";

export const requestResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> => {
    const requestService = inject(RequestService);
    const requestId = route.paramMap.get('id');
    const userToken = localStorage.getItem('token');

    return requestService.getRequestById(requestId, userToken)
}