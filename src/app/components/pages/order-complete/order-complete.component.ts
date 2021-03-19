import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-complete',
  templateUrl: './order-complete.component.html',
  styleUrls: ['./order-complete.component.sass']
})
export class OrderCompleteComponent implements OnInit {
id
email
sub
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
   this.sub = this.route.paramMap.subscribe(params => {
      this.id = params.get('id')
      this.email = params.get('email')
    })


  }
  ngOnDestroy() {
    this.sub.unsubscribe()

}
}
