import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-popup-delete-config-table',
  templateUrl: './popup-delete-config-table.component.html',
  styleUrls: ['./popup-delete-config-table.component.css']
})
export class PopupDeleteConfigTableComponent {
  constructor() { }

  @Input() code: string = '';
  @Input() tableName: string = '';
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
