import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {


  title = 'date-mask';
  date = new FormControl('', {
    validators: Validators.required,
    // updateOn: 'blur'
  });

  ngOnInit(): void {
    this.date.valueChanges.subscribe( x => console.log('value ', x ));
  }

  markAsTouched() {
    // console.log('markAsTouched');
    this.date.markAsTouched();
    this.date.markAsDirty();
    // console.log('curentValue ', this.date.value);
  }

}
