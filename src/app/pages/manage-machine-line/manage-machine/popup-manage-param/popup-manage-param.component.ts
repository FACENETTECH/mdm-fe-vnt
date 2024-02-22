import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
import { DATA_TYPE } from 'src/app/utils/constrant';

@Component({
  selector: 'app-popup-manage-param',
  templateUrl: './popup-manage-param.component.html',
  styleUrls: ['./popup-manage-param.component.css']
})
export class PopupManageParamComponent {
  @Input() isvisible: boolean = true;
  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();

  columns: any[] = [];
  listParam: any[] = [];
  inforParam: Record<string, any> = {};
  noDataFound: boolean = false;
  valueSelectBox: any = []; // Lưu trữ các giá trị của những trường có type là select box

  ngOnInit() {
    this.columns = dummyColumns;
    this.listParam = dummyData;
  }

  handleCancel(): void {
    this.isvisible = false;
    this.isvisibleChange.emit(false);
  }

  id = -1;
  onResize({ width }: NzResizeEvent, i: number): void {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.columns[i].width = width + 'px';
    });
  }

  customSortFunction(event: any, sortColumn: string) {}

  clearInput(keyName: string) {
    this.inforParam[keyName] = '';
  }

  searchSelectBox($event: any) {
    // const searchData = {
    //   page: this.pageNumber,
    //   size: this.pageSize,
    // };
    // this.getData(searchData);
  }

  search($event: any) {
    // if ($event.keyCode === 13) {
    //   const searchData = {
    //     page: this.pageNumber,
    //     size: this.pageSize,
    //   };

    //   this.getData(searchData);
    // }
  }


  /**
   * Hàm gọi API và xử lý dữ liệu option cho select box
   */
   handleOpenChangeDataTypeParam(data: any, column: any) {
    // if(data) {
    //   this.manageComponentService.getParamByTableNameAndColumnName(column.tableName, column.keyName).subscribe({
    //     next: (res) => {
    //       this.valueSelectBox = res.data;
    //     }, error: (err) => {
    //       this.toast.error(err.error.result.message);
    //     }
    //   })
    // }
  }

  protected readonly dataType = DATA_TYPE;
}

const dummyColumns = [
  {
    "id": 88,
    "index": 1,
    "tableName": "param",
    "keyName": "param_id",
    "keyTitle": "Id tham số",
    "isRequired": true,
    "dataType": 2,
    "hasUnit": false,
    "relateTable": null,
    "relateColumn": null,
    "note": null,
    "addition": null,
    "width": "200px",
    "isCode": true,
    "searchTree": null,
    "localCheck": true
  },
  {
    "id": 88,
    "index": 2,
    "tableName": "param",
    "keyName": "param_code",
    "keyTitle": "Mã tham số",
    "isRequired": true,
    "dataType": 2,
    "hasUnit": false,
    "relateTable": null,
    "relateColumn": null,
    "note": null,
    "addition": null,
    "width": "200px",
    "isCode": false,
    "searchTree": null,
    "localCheck": true
  },
  {
    "id": 88,
    "index": 3,
    "tableName": "param",
    "keyName": "param_value",
    "keyTitle": "Giá trị tham số",
    "isRequired": true,
    "dataType": 2,
    "hasUnit": false,
    "relateTable": null,
    "relateColumn": null,
    "note": null,
    "addition": null,
    "width": "200px",
    "isCode": false,
    "searchTree": null,
    "localCheck": true
  },
  {
    "id": 88,
    "index": 4,
    "tableName": "param",
    "keyName": "param_desc",
    "keyTitle": "Mô tả",
    "isRequired": false,
    "dataType": 2,
    "hasUnit": false,
    "relateTable": null,
    "relateColumn": null,
    "note": null,
    "addition": null,
    "width": "200px",
    "isCode": false,
    "searchTree": null,
    "localCheck": true
  }
]

const dummyData = [
  {
    param_id: 1,
    param_code: 'PR001',
    param_value: 'CRV',
    param_desc: 'Note'
  },
  {
    param_id: 1,
    param_code: 'PR001',
    param_value: 'CRV',
    param_desc: 'Note'
  },
  {
    param_id: 1,
    param_code: 'PR001',
    param_value: 'CRV',
    param_desc: 'Note'
  }
]
