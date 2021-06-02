import { Injectable } from '@angular/core';
import { HttpRequest, HttpErrorResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AlertifyService } from '../_service/alertify.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_service/authentication.service';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
    constructor(
        private alertify: AlertifyService
        , private authService: AuthenticationService,
        private router: Router
    ) { }
    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            // A client-side or network error occurred. Handle it accordingly.
            // alert(`Hệ thống không hoạt động vì lỗi mạng. Vui lòng nhấn F5 để thử lại.
            //          The system does not work due to network error. Please press F5 to try again!
            //   `);
            console.error('An error occurred: status = 0');
        } else {
            // The backend returned an unsuccessful response code.
            switch (error.status) {
                case 401:
                    this.authService.clearLocalStorage();
                    this.router.navigate(['login'], {
                        queryParams: { returnUrl: this.router.routerState.snapshot.url },
                    });
                    break;
                case 400:
                    console.error(error.error);
                    break;
                case 500:
                    console.error("Máy chủ đang gặp vấn đề. Vui lòng thử lại sau!<br> The server error. Please try again after sometime!");
                    break;
            }
            // The response body may contain clues as to what went wrong.
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // Return an observable with a user-facing error message.
        return throwError(
            'Something bad happened; please try again later.');
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with basic auth credentials if available
        if (localStorage.getItem('token')) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
        }
        // return next.handle(request);
        return next.handle(request).pipe(
            retry(1),
            catchError(this.handleError)
            // catchError((error: HttpErrorResponse) => {
            //     let errorMessage = '';
            //     if (error.error instanceof ErrorEvent) {
            //         // client-side error
            //         errorMessage = `Error: ${error.error.message}`;
            //     } else {
            //         // server-side error
            //         errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}\nError Status: ${error.statusText}`;
            //         switch (error.status) {
            //             // case 0:
            //             // alert(`
            //             // Hệ thống không hoạt động vì lỗi mạng. Vui lòng nhấn F5 để thử lại hoặc liên hệ phòng IT.
            //             // The system does not work due to network error. Please press F5 to try again or contact IT department!
            //             // `);
            //             // return throwError(errorMessage);
            //             case 401:
            //                 this.authService.clearLocalStorage();
            //                 this.router.navigate(['login'], {
            //                     queryParams: { returnUrl: this.router.routerState.snapshot.url },
            //                 });
            //                 return throwError(error.error || errorMessage);
            //         //   case 400:
            //         //     this.alertify.error(error.error || errorMessage);
            //         //     return throwError(error.error);
            //         //   case 500:
            //         //     this.alertify.error("Máy chủ đang gặp vấn đề. Vui lòng thử lại sau!<br> The server error. Please try again after sometime!");
            //         //     return throwError(error);
            //         }
            //     }
            //     return throwError(error);
            // })
        );
    }
}
