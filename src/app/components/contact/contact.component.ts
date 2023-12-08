import { Component } from '@angular/core';
import { Contact } from 'src/app/models/Contact';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  contact: Contact;

  ngOnInit() {
    this.contact = {
      name: '',
      numberOfPeople: 0,
      dateAndTime: '',
      message: ''
    };
  }

}
