import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable } from 'rxjs';
import { ManageComponentService } from 'src/app/services/manage-component/manage-component.service';

@Component({
  selector: 'app-preview-template',
  templateUrl: './preview-template.component.html',
  styleUrls: ['./preview-template.component.css']
})
export class PreviewTemplateComponent {
  constructor(
    private sanitizer: DomSanitizer,
    private manageService: ManageComponentService,
    private toastr: ToastrService,
    private loader: NgxUiLoaderService
  ) {}

  @Input() pdfBlPrntSrc?: any;
  @Input() inforTemplate?: any;
  @Input() isvisible: boolean = false;
  @Input() editPDF: boolean = false;
  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() preview: EventEmitter<boolean> = new EventEmitter()
  url: any;
  urlDownload?: string;

  ngOnInit() {
    this.getInforTemplate();
  }

  /**
   * Lấy ra thông tin file biểu mẫu
   */
  getInforTemplate() {
    if(this.inforTemplate != null && this.inforTemplate != undefined) {
      this.manageService.getFileTemplate(this.inforTemplate.id).subscribe({
        next: (res) => {
          console.log(res);
          this.urlDownload = res.data;
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://view.officeapps.live.com/op/embed.aspx?src=' + res.data)
        }, error: (err) => {
          this.toastr.error(err.error.result.message);
        }
      })
    }
  }

  /**
   * Hàm chuyển đổi base64 thành blod
   * @param b64Data chuỗi base64 cần chuyển đổi
   * @param contentType kiểu dữ liệu cần chuyển đổi về
   * @param sliceSize 
   * @returns 
   */
  b64toBlob(b64Data: any, contentType: any, sliceSize=512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
      
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  handleCancel(){
    this.isvisibleChange.emit(false);
  }

  form: FormData = new FormData();
  handleChange = (item: any) => {
    // const blobUrl = window.URL.createObjectURL(item.target.files[0]);
    // this.pdfBlPrntSrc = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
    this.form = new FormData();
    this.form.append('file', item.target.files[0]);
  };

  submit(){
    if(this.form.has('file')) {
      this.loader.start();
      this.manageService.uploadFileTemplate(this.inforTemplate.id, this.form).subscribe(
        {
          next: (res) => {
            this.isvisibleChange.emit(false);
            this.preview.emit(true);
            this.loader.stop();
            this.toastr.success(res.result.message);
          },
          error: (err) => {
            this.loader.stop();
            this.toastr.error(err.result.message);
          }
        }
      )
    }else {
      this.isvisibleChange.emit(false);
    }
  }

  @HostListener('document:keydown.enter', ['$event'])
  onKeydownEnter(event: KeyboardEvent): void {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt
    event.stopPropagation(); // Ngăn chặn sự kiện lan truyền lên các thành phần khác
    this.submit();
  }
}
