import { ProductService } from '../../shared/services/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.sass']
})
export class AccountDetailsComponent implements OnInit {
userDetails

  constructor(private productService: ProductService){}


  ngOnInit() {
    this.productService.viewer()
    .subscribe(res => {
      this.userDetails = res
    console.log(res)}
    )
  }


  }
