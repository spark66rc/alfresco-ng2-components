/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    HttpHandler, HttpHeaderResponse, HttpHeaders, HttpInterceptor, HttpProgressEvent, HttpRequest, HttpResponse, HttpSentEvent, HttpUserEvent
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { BaseAuthenticationService } from '../base-authentication.service';

@Injectable()
export class AuthBearerInterceptor implements HttpInterceptor {
  private excludedUrlsRegex: RegExp[];

  constructor(private injector: Injector, private authService: BaseAuthenticationService) { }

  private loadExcludedUrlsRegex() {
    const excludedUrls: string[] = this.authService.getBearerExcludedUrls();

    this.excludedUrlsRegex = excludedUrls.map((urlPattern) => new RegExp(urlPattern, 'i')) || [];
  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

    this.authService = this.injector.get(BaseAuthenticationService);

    if (!this.authService || !this.authService.getBearerExcludedUrls()) {
      return next.handle(req);
    }

    if (!this.excludedUrlsRegex) {
      this.loadExcludedUrlsRegex();
    }

    const urlRequest = req.url;
    const shallPass: boolean = this.excludedUrlsRegex.some((regex) => regex.test(urlRequest));
    if (shallPass) {
      return next.handle(req)
        .pipe(
          catchError((error) => observableThrowError(error))
        );
    }

    return this.authService.addTokenToHeader(req.headers)
      .pipe(
        mergeMap((headersWithBearer) => {
          const headerWithContentType = this.appendJsonContentType(headersWithBearer);
          const kcReq = req.clone({ headers: headerWithContentType});
          return next.handle(kcReq)
            .pipe(
              catchError((error) => observableThrowError(error))
           );
      })
      );
  }

  private appendJsonContentType(headers: HttpHeaders): HttpHeaders {
    return headers.set('Content-Type', 'application/json;charset=UTF-8');
  }

}