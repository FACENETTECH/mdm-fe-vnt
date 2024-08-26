import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ExportService } from 'src/app/services/export.service';
import { ManageComponentService } from 'src/app/services/manage-component/manage-component.service';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-popup-import-form-excel',
  templateUrl: './popup-import-form-excel.component.html',
  styleUrls: ['./popup-import-form-excel.component.css']
})
export class PopupImportFormExcelComponent {
  constructor(
    private exportService: ExportService,
    private manageService: ManageComponentService,
    private toastr: ToastrService
  ) {}

  @Input() isvisible: boolean = false;
  @Input() formData: any[] = [];
  @Input() header: any[] = [];
  @Input() TemplateName: string = '';
  @Input() entityType: number = 0;
  @Input() tableCode: string = '';
  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() import: EventEmitter<any> = new EventEmitter();

  ngOnInit() {}

  downloadTemplate() {
    this.manageService.downloadTemplateFileToImport(this.tableCode).subscribe({
      next: (res) => {
        saveAs(res, `${this.tableCode}.xlsx`);
      }, error: (err) => {
        this.toastr.error(err.error.result.message);
      }
    })
  }

  form = new FormData();
  handleChange = (item: any) => {
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
