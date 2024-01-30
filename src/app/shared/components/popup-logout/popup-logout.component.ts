import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-popup-logout',
  templateUrl: './popup-logout.component.html',
  styleUrls: ['./popup-logout.component.css']
})
export class PopupLogoutComponent implements OnInit {

  constructor() { }

  @Input() isvisible: boolean = false;
  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() logout: EventEmitter<boolean> = new EventEmitter()

  ngOnInit() {
  }

  

  handleCancel(){
    this.isvisibleChange.emit(false);
  }

  submit(){
    this.isvisibleChange.emit(false);
    this.logout.emit()
  }

}
