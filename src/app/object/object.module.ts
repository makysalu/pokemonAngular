import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObjectsComponent } from './pages/objects/objects.component';
import { FormSearchComponent } from './components/form-search/form-search.component';
import { TableResultComponent } from './components/table-result/table-result.component';
import { ObjectService } from './services/object/object.service';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ObjectsComponent,
    FormSearchComponent,
    TableResultComponent
  ],
  exports: [
    ObjectsComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
    ObjectService
  ],
})
export class ObjectModule { }
