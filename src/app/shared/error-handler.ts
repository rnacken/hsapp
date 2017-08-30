import { ErrorHandler } from '@angular/core';

export class MyErrorHandler implements ErrorHandler {
    handleError(error) {
        // handle error
        console.error(error);
    }
}