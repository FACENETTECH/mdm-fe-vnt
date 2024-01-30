import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-popup-update',
  templateUrl: './popup-update.component.html',
  styleUrls: ['./popup-update.component.css'],
})
export class PopupUpdateComponent implements OnInit {
  constructor() {}

  @Input() tableName: string = '';
  @Input() isvisible: boolean = false;
  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() update: EventEmitter<boolean> = new EventEmitter();

  ngOnInit() {}

  handleCancel() {
    this.isvisibleChange.emit(false);
  }

  submit() {
    this.isvisibleChange.emit(false);
    this.update.emit();
  }
}
