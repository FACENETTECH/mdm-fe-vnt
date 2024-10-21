import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ExportService } from 'src/app/services/export.service';
import { ManageComponentService } from 'src/app/services/manage-component/manage-component.service';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-popup-import-excel',
  templateUrl: './popup-import-excel.component.html',
  styleUrls: ['./popup-import-excel.component.css']
})
export class PopupImportExcelComponent {
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
  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() import: EventEmitter<any> = new EventEmitter();

  ngOnInit() {}

  downloadTemplate() {
    this.manageService.downloadTemplateBOMFileToImport().subscribe({
      next: (res) => {
        saveAs(res, `bom-file.xlsx`);
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
