import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';

@Component({
  selector: 'your-snack-bar',
  template: '{{ data.firstLine }} <br> {{ data.secondLine }}',  // Any Html as per your wish
})
export class SnackbarTwoLinesComponent{
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}
