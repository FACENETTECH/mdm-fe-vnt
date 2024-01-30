import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'src/app/services/manage-config/config.service';

@Component({
  selector: 'app-infor-column',
  templateUrl: './infor-column.component.html',
  styleUrls: ['./infor-column.component.css'],
})
export class InforColumnComponent implements OnInit {
  constructor(
    private toast: ToastrService,
    private configService: ConfigService
  ) {}

  ngOnInit() {
    this.keyTitle = this.column.keyTitle;
    this.dataType = this.column.dataType;
    this.check = this.column.check;
    this.isRequired = this.column.isRequired;
    this.entryIndex = this.column.entryIndex;
    this.entityType = this.column.entityType;

    this.entryNumber = Array(this.total)
      .fill(1)
      .map((x, i) => i + 1);
  }
  isvisibleUpdate: boolean = false;

  @Input() isvisible: boolean = false;
  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();

  @Input() column: any = '';
  @Input() total: number = 0;

  keyTitle: string = this.column.keyTitle;
  dataType: number = this.column.dataType;
  check: boolean = this.column.check;
  isRequired: boolean = this.column.isRequired;
  entryIndex: number = this.column.entryIndex;
  entityType: number = this.column.entityType;

  isvisibleCancel: boolean = false;

  checkKeyTitle: string = '';

  entryNumber: any[] = [];

  checkValid() {
    let charSpecial = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (this.keyTitle) {
      this.checkKeyTitle = '';
    } else if (charSpecial.test(this.keyTitle)) {
      this.checkKeyTitle = 'Tên cột hiển thị không được chứa kí tự đặc biệt';
    } else {
      this.checkKeyTitle = 'Bạn chưa nhập Tên cột hiển thị ';
    }
  }

  submitDemo() {
    this.isvisibleUpdate = true;
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
        entityType: this.entityType,
        entryIndex: this.entryIndex,
        required: this.isRequired,
      };
      console.log(request);

      let res = await this.configService.updateColumn(
        this.column.keyName,
        request
      );
      if (res.result.ok) {
        this.toast.success('Cập nhật cột thành công', 'Thành công');
      } else {
        this.toast.error(res.result.message, 'Thất bại');
      }
      this.isvisibleChange.emit(false);
    }
  }

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
}
