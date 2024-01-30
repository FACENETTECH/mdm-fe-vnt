import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { ToastrService } from 'ngx-toastr';
import { ExportService } from 'src/app/services/export.service';
import { ManageStageService } from 'src/app/services/manage-machine-line/manage-stage/manage-stage.service';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-popup-import',
  templateUrl: './popup-import.component.html',
  styleUrls: ['./popup-import.component.css'],
})
export class PopupImportComponent implements OnInit {
  constructor(
    private toast: ToastrService,
    private exportService: ExportService,
    private http: HttpClient
  ) {}

  @Input() isvisible: boolean = false;
  @Input() formData: any[] = [];
  @Input() header: any[] = [];
  @Input() TemplateName: string = '';
  @Input() entityType: number = 0;
  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() import: EventEmitter<any> = new EventEmitter();

  ngOnInit() {}

  downloadTemplate() {
    console.log(this.header);

    this.exportService.exportExcelTemplate(this.header, this.TemplateName);
  }

  form = new FormData();
  handleChange = (item: any) => {
    console.log(item);

    this.form.append('file', item.file.originFileObj);
  };

  isvisibleCancel: boolean = false;

  handleCancel() {
    this.isvisibleCancel = true;
  }

  cancelConfirm() {
    this.isvisibleChange.emit(false);
  }

  submit() {
    this.isvisibleChange.emit(false);
    this.import.emit(this.form);
  }
}
