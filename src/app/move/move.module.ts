import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovesComponent } from './pages/moves/moves.component';
import { FormSearchComponent } from './components/form-search/form-search.component';
import { TableResultComponent } from './components/table-result/table-result.component';
import { FormsModule } from '@angular/forms';
import { MoveService } from './services/move/move.service';



@NgModule({
  declarations: [
    MovesComponent,
    FormSearchComponent,
    TableResultComponent
  ],
  exports:[
    MovesComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
    MoveService
  ]
})
export class AbilityModule { }
