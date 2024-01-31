import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pagination',
  template: `
    <div nz-row style="margin-top: 30px;">
    <nz-select [(ngModel)]="currentSize" style="width: 100%" nz-col [nzSpan]="3" (ngModelChange)="changeSize()">
      <nz-option [nzValue]="20" nzLabel="20/{{'page' | translate}}" ></nz-option>
      <nz-option [nzValue]="40"  nzLabel="40/{{'page' | translate}}"></nz-option>
      <nz-option [nzValue]="80" nzLabel="80/{{'page' | translate}}"></nz-option>
    </nz-select>
    <div nz-col [nzSpan]="6"></div>
      <nz-pagination
      nz-col
      [nzSpan]="11"
        [(nzPageIndex)]="currentPage"
        [nzTotal]="total"
        [nzSize]="'small'"
        [(nzPageSize)]="currentSize?currentSize:total"
        [nzResponsive]="false"
        (nzPageSizeChange)="changeSize()"
        (nzPageIndexChange)="
          emitPage.emit({ page: currentPage, size: currentSize })
        "
        [nzShowTotal]="rangeTemplate"
      ></nz-pagination>

      <ng-template #rangeTemplate let-range="range" let-total>
        {{"page" | translate}} {{currentPage}} {{'of' | translate}} {{totalPage}}  {{' ('}}{{total}} {{'record' | translate}}{{')'}} 
      </ng-template>
    <div nz-col [nzSpan]="4" style="display: flex; justify-content: space-between; ">
      <p style="margin: 0; line-height: 30px; width: 70%; text-align: right;margin-right: 10px;">{{"goTo" | translate}}</p> <input [value]="currentPage" (keyup)="changePage($event)" style="width: 30%" type="text" nz-input >

    </div>
    </div>
  `,
})
export class PaginationComponent {
  constructor(
    private toast: ToastrService,
  ){}
  @Input() total: number = 0;
  @Output() emitPage: EventEmitter<any> = new EventEmitter();
  @Input() currentPage = 1;

  @Input() currentSize = 20;

  pageSize: any;
  totalPage: number = 0;
  getPage(page: number) {
    this.currentPage = page;
  }
  getSize(size: number) {
    this.currentSize = size;
  }
  changeSize(){
    
    
    this.totalPage = this.currentSize?Math.ceil(this.total/this.currentSize):1;
    this.emitPage.emit({ page: this.currentPage, size: this.currentSize })
  }
  changePage($event: any){
    let page = this.currentPage;
    if($event.keyCode == 13){
      this.currentPage = $event.target.value;

      if(this.currentPage < 1){
        this.toast.warning('Trang nhỏ nhất là 1');
        this.currentPage = page;
      }
      else if(this.currentPage > this.totalPage){
        this.toast.warning('Trang lớn nhất là ' + this.totalPage);
        this.currentPage = page;
      }
      else{
          this.emitPage.emit({ page: this.currentPage, size: this.currentSize })
      }
    }
  }
  ngOnInit(): void {
    this.totalPage = this.currentSize?Math.ceil(this.total/this.currentSize):1;

    console.log(this.totalPage);
    
    // this.emitPage.emit({ page: this.currentPage, size: this.currentSize });
  }
}
