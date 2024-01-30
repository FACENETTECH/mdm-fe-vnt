import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-popup-copy',
  templateUrl: './popup-copy.component.html',
  styleUrls: ['./popup-copy.component.css']
})
export class PopupCopyComponent {
  constructor() { }

  @Input() isvisible: boolean = false;
  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() copy: EventEmitter<boolean> = new EventEmitter()

  ngOnInit() {
  }

  handleCancel(){
    this.isvisibleChange.emit(false);
  }

  submit(){
    this.isvisibleChange.emit(false);
    this.copy.emit()
  }
}
