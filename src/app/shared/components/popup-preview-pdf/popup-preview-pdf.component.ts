import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-popup-preview-pdf',
  templateUrl: './popup-preview-pdf.component.html',
  styleUrls: ['./popup-preview-pdf.component.css']
})
export class PopupPreviewPdfComponent {
  constructor(
    private sanitizer: DomSanitizer,
  ) {}

  @Input() titlePopup: string = 'Xem bản vẽ';
  @Input() pdfBlPrntSrc?: any;
  @Input() blPrntCode: string = '';
  @Input() isvisible: boolean = false;
  @Input() editPDF: boolean = false;
  @Input() isShowCheckboxPrint: boolean = false;
  @Input() isShowDropdown: boolean = false;
  @Input() typeDropdown: number = -1;
  @Input() customer_code: string = '';
  @Input() request: Record<string, any> = {};
  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() preview: EventEmitter<boolean> = new EventEmitter();
  customerPrintForm: any[] = ['GES', 'MBC', 'YVL', 'JVC', 'INVOICE'];
  customerPrintStamp: any[] = ['GES', 'MBC'];

  ngOnInit() {
    if (this.typeDropdown == 1) {
      if (!this.customerPrintForm.includes(this.customer_code)) {
        this.customer_code = '';
      }
    } else if (this.typeDropdown == 2) {
      if (!this.customerPrintStamp.includes(this.customer_code)) {
        this.customer_code = '';
      }
    }
  }

  handleCancel() {
    this.isvisibleChange.emit(false);
  }

  handleChangeValueCheckbox(event: any) {}

  handleChangeValueDropdown(event: any) {}

  form: FormData = new FormData();
  handleChange = (item: any) => {
    const blobUrl = window.URL.createObjectURL(item.target.files[0]);
    this.pdfBlPrntSrc = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
    this.form = new FormData();
    this.form.append('file', item.target.files[0]);
  };

  submit() {
    this.isvisible = false;
    this.isvisibleChange.emit(this.isvisible);
  }

  @HostListener('document:keydown.enter', ['$event'])
  onKeydownEnter(event: KeyboardEvent): void {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt
    event.stopPropagation(); // Ngăn chặn sự kiện lan truyền lên các thành phần khác
    this.submit();
  }

  @HostListener('document:keydown.control.s', ['$event'])
  onKeydownCtrlS(event: KeyboardEvent): void {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt
    event.stopPropagation(); // Ngăn chặn sự kiện lan truyền lên các thành phần khác
    this.submit();
  }
}
