import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-popup-cancel',
  templateUrl: './popup-cancel.component.html',
  styleUrls: ['./popup-cancel.component.css']
})
export class PopupCancelComponent implements OnInit {

  constructor() { }

  @Input() isvisible: boolean = false;
  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() cancel: EventEmitter<boolean> = new EventEmitter()

  ngOnInit() {
  }

  handleCancel(){
    this.isvisibleChange.emit(false);
  }

  submit(){
    this.isvisibleChange.emit(false);
    this.cancel.emit()
  }

}
