import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColumnService } from 'src/app/services/column.service';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'src/app/services/manage-config/config.service';

@Component({
  selector: 'app-add-column',
  templateUrl: './add-column.component.html',
  styleUrls: ['./add-column.component.css'],
})
export class AddColumnComponent implements OnInit {
  constructor(
    private toast: ToastrService,
    private columnService: ColumnService,
    // private toast: ToastrService,
    private configService: ConfigService
  ) {}

  @Input() isvisible: boolean = false;
  @Input() entryType: number = 0;
  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();

  isvisibleAdd: boolean = false;

  checkAction: boolean = false;
  handleCancel() {
    if (this.checkAction) {
      this.isvisibleCancel = true;
    } else {
      this.isvisibleChange.emit(false);
    }
  }

  cancelConfirm() {
    this.isvisibleChange.emit(false);
  }

  isvisibleCancel: boolean = false;

  keyTitle: string = '';
  dataType: number = 3;
  check: boolean = true;
  isFixed: number = 1;
  isRequired: boolean = true;

  checkKeyTitle: string = '';

  ngOnInit() {}

  checkValid() {
    console.log(this.keyTitle);

    let charSpecial = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    console.log(charSpecial.test(this.keyTitle));

    if (charSpecial.test(this.keyTitle)) {
      this.checkKeyTitle = 'Tên cột hiển thị không được chứa kí tự đặc biệt';
    } else if (this.keyTitle) {
      this.checkKeyTitle = '';
    } else {
      this.checkKeyTitle = 'Bạn chưa nhập Tên cột hiển thị ';
    }
  }

  submitDemo() {
    this.isvisibleAdd = true;
  }
  async submit() {
    if (!this.keyTitle) {
      this.toast.warning('Bạn chưa nhập tên cột');
    } else if (this.checkKeyTitle) {
      this.toast.warning(this.checkKeyTitle);
    } else {
      let request = {
        keyTitle: this.keyTitle,
        width: '200px',
        check: this.check,
        dataType: this.dataType,
        entityType: this.entryType,
        required: this.isRequired,
      };
      console.log(request);

      let res = await this.configService.createColumn(request);
      if (res.result.ok) {
        this.toast.success('Thêm mới cột thành công', 'Thành công');
      } else {
        this.toast.error(res.result.message, 'Thất bại');
      }
      this.isvisibleChange.emit(false);
    }
  }

  closeAdd() {
    this.isvisibleAdd = false;
  }
}
