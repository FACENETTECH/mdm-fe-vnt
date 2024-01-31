import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popup-delete-list-recodrd',
  templateUrl: './popup-delete-list-recodrd.component.html',
  styleUrls: ['./popup-delete-list-recodrd.component.css']
})
export class PopupDeleteListRecodrdComponent {
  constructor() { }

  @Input() isvisible: boolean = false;
  @Input() title: string = "";
  @Input() deleteType: string = "";
  @Input() deleteCode: string = "";
  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() delete: EventEmitter<boolean> = new EventEmitter()

  ngOnInit() {
  }

  

  handleCancel(){
    this.isvisibleChange.emit(false);
  }

  submit(){
    this.isvisibleChange.emit(false);
    this.delete.emit()
  }
}
