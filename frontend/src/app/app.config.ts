import {ApplicationConfig, FactoryProvider} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient} from "@angular/common/http";
import {TransactionService} from "./services/transaction.service";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {PinchZoomModule} from "ngx-pinch-zoom";

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes),
        provideHttpClient(),
        TransactionService,
        PinchZoomModule,
        provideAnimationsAsync(),
    ]
};
