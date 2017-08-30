import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
        MaterialModule,
//        MdButtonModule, 
//        MdCheckboxModule,
//        MdCardModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
//    MdButtonModule, 
//    MdCheckboxModule,
  ],
  exports: [
    MaterialModule,
//    MdButtonModule, 
//    MdCheckboxModule,
  ],
  declarations: []
})
export class HsMaterialModule { }
