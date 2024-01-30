import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-popup-add',
  templateUrl: './popup-add.component.html',
  styleUrls: ['./popup-add.component.css']
})
export class PopupAddComponent implements OnInit {

  constructor() { }

  @Input() isvisible: boolean = false;
  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() add: EventEmitter<boolean> = new EventEmitter()

  ngOnInit() {
  }

  handleCancel(){
    this.isvisibleChange.emit(false);
  }

  submit(){
    this.isvisibleChange.emit(false);
    this.add.emit()
  }

}
