import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  Event,
  NavigationStart,
  NavigationEnd,
  NavigationError,
} from '@angular/router';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
import { ToastrService } from 'ngx-toastr';
import { ExportService } from 'src/app/services/export.service';
import { ConfigService } from 'src/app/services/manage-config/config.service';
import { environment } from 'src/environment/environment';
import {
  CdkDragDrop,
  moveItemInArray,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css'],
})
export class ConfigComponent implements OnInit {
  constructor(
    private toast: ToastrService,
    private configService: ConfigService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private http: HttpClient,
    private exportService: ExportService,
    private loader: NgxUiLoaderService
  ) {
    this.router.events.subscribe((e: Event) => {
      if (e instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
  }

  columns: any[] = [];
  columnsToExport: any[] = [];
  header: any[] = [
    'Số thứ tự',
    'Tên cột hiển thị',
    'Kiểu dữ liệu',
    'Bắt buộc nhập',
    'Trạng thái',
  ];

  columnWidth: any[] = ['68px', '220px', '120px', '150px', '150px', ''];

  total: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;

  common: string = '';
  keyTitle: string = '';
  dataType: string | number = '';
  isRequired: string | boolean = '';
  check: string | boolean = '';
  entryIndex: number | string = '';

  noDataFound: boolean = false;

  currentColumn: any = '';

  optionsComplete: any[] = [];

  entityType: number = this.actRoute.snapshot.params['id'];

  title: string = '';

  breadcrumbs: any[] = [];

  isvisibleAddColumn: boolean = false;
  isvisibleEditColumn: boolean = false;
  isvisibleImport: boolean = false;
  isvisibleDelete: boolean = false;

  isSearch: boolean = true;

  ngOnInit() {
    this.loader.start();
    this.total = 0;
    this.entityType = this.actRoute.snapshot.params['id'];
    this.getColumn({ page: this.pageNumber, size: this.pageSize });
    if (this.entityType == 1) {
      this.title = 'sider.configureStage';
    } else if (this.entityType == 2) {
      this.title = 'sider.configureSupplier';
    } else if (this.entityType == 3) {
      this.title = 'Quản lý cấu hình công việc';
    } else if (this.entityType == 4) {
      this.title = 'sider.configureError';
    } else if (this.entityType == 5) {
      this.title = 'Quản lý cấu hình nhóm lỗi';
    } else if (this.entityType == 6) {
      this.title = 'sider.configureMachine';
    } else if (this.entityType == 7) {
      this.title = 'Quản lý cấu hình dây chuyền';
    } else if (this.entityType == 8) {
      this.title = 'Quản lý cấu hình bán thành phẩm';
    } else if (this.entityType == 9) {
      this.title = 'sider.configureProduct';
    } else if (this.entityType == 10) {
      this.title = 'sider.configureMaterial';
    } else if (this.entityType == 11) {
      this.title = 'sider.configureEmployee';
    } else if (this.entityType == 12) {
      this.title = 'Quản lý cấu hình nhóm tổ';
    } else if (this.entityType == 103) {
      this.title = 'sider.configureFileDesign';
    } else if (this.entityType == 16) {
      this.title = 'sider.configureBOM';
    } else if (this.entityType == 10) {
      this.title = 'sider.configureMaterial';
    }

    this.breadcrumbs = [
      {
        name: 'Quản lý cấu hình',
        route: '',
      },
      {
        name: this.title,
        route: `/manage-config/${this.entityType}`,
      },
    ];
    this.loader.stop();
  }

  async getColumn(page: { page: number; size: number }) {
    if (
      this.common ||
      this.keyTitle ||
      this.dataType ||
      this.isRequired ||
      this.check
    ) {
      let request = {
        pageNumber: 0,
        pageSize: 0,
        common: this.common,
        filter: {
          keyTilte: this.keyTitle,
          check: this.check,
          required: this.isRequired,
          entityType: this.entityType,
          dataType: this.dataType,
        },
      };

      let res = await this.configService.searchColumn(request);
      this.pageNumber = page.page;
      if (page.size != this.pageSize) {
        this.pageNumber = 1;
      } else {
        this.pageSize = page.size;
      }
      console.log(this.pageNumber);
      this.total = res.data.length;
      let start = page.size * (page.page - 1);
      let end =
        start + page.size < res.data.length
          ? start + page.size
          : res.data.length;
      this.columns = res.data.splice(start, end);
    } else {
      this.pageNumber = page.page;
      if (page.size != this.pageSize) {
        this.pageNumber = 1;
        this.pageSize = page.size;
      }

      let res = await this.configService.getColumn(this.entityType);

      if (res.result.ok) {
        this.total = res.data.length;
        res.data.map((x: any) => {
          x.localCheck = true;
        });
        if (this.entityType == 6) {
          localStorage.setItem('machine', JSON.stringify(res.data));
        } else if (this.entityType == 1) {
          localStorage.setItem('stage', JSON.stringify(res.data));
        } else if (this.entityType == 2) {
          localStorage.setItem('vendor', JSON.stringify(res.data));
        } else if (this.entityType == 3) {
          localStorage.setItem('job', JSON.stringify(res.data));
        } else if (this.entityType == 4) {
          localStorage.setItem('error', JSON.stringify(res.data));
        } else if (this.entityType == 5) {
          localStorage.setItem('errorGroup', JSON.stringify(res.data));
        } else if (this.entityType == 7) {
          localStorage.setItem('line', JSON.stringify(res.data));
        } else if (this.entityType == 8) {
          localStorage.setItem('btp', JSON.stringify(res.data));
        } else if (this.entityType == 9) {
          localStorage.setItem('tp', JSON.stringify(res.data));
        } else if (this.entityType == 10) {
          localStorage.setItem('nvl', JSON.stringify(res.data));
        } else if (this.entityType == 11) {
          localStorage.setItem('employee', JSON.stringify(res.data));
        } else if (this.entityType == 12) {
          localStorage.setItem('teamGroup', JSON.stringify(res.data));
        } else if (this.entityType == 16) {
          localStorage.setItem('bom', JSON.stringify(res.data));
        }
        let start = this.pageSize * (this.pageNumber - 1);
        let end =
          start + this.pageSize < res.data.length
            ? start + this.pageSize
            : res.data.length;
        this.columns = res.data.splice(start, end);
      }
    }
  }

  async searchSelectBox($event: any) {
    let request = {
      pageNumber: 0,
      pageSize: 0,
      common: this.common,
      filter: {
        keyTilte: this.keyTitle,
        check: this.check,
        required: this.isRequired,
        entityType: this.entityType,
        dataType: this.dataType,
      },
    };
    this.pageNumber = 1;

    let res = await this.configService.searchColumn(request);
    if (res.result.ok) {
      this.total = res.data.length;
      let start = this.pageSize * (this.pageNumber - 1);
      let end =
        start + this.pageSize < res.data.length
          ? start + this.pageSize
          : res.data.length;
      this.columns = res.data.splice(start, end);
    } else {
      this.toast.error(res.result.message);
    }
  }

  async search($event: any) {
    if ($event.keyCode == 13) {
      let request = {
        pageNumber: 0,
        pageSize: 0,
        common: this.common,
        filter: {
          keyTitle: this.keyTitle,
          check: this.check,
          required: this.isRequired,
          entityType: this.entityType,
          dataType: this.dataType,
        },
      };
      this.pageNumber = 1;

      let res = await this.configService.searchColumn(request);
      if (res.result.ok) {
        this.total = res.data.length;
        let start = this.pageSize * (this.pageNumber - 1);
        let end =
          start + this.pageSize < res.data.length
            ? start + this.pageSize
            : res.data.length;
        this.columns = res.data.splice(start, end);
      } else {
        this.toast.error(res.result.message);
      }
    }
  }

  async autoComplete($event: any) {
    setTimeout(async () => {
      let request = {
        pageNumber: 0,
        pageSize: 10,
        common: this.common,
        filter: {
          keyTitle: this.keyTitle,
          entityType: this.entityType,
        },
      };

      let res = await this.configService.searchColumn(request);
      if (res.result.ok) {
        this.optionsComplete = [];
        if ($event.target.value) {
          res.data.map((x: any) => {
            this.optionsComplete.push(x.keyTitle);
          });
          console.log(this.optionsComplete);
        }
      } else {
        this.toast.error(res.result.message);
      }
    }, 500);
  }

  async autoCompleteCommon($event: any) {
    setTimeout(async () => {
      let request = {
        pageNumber: 0,
        pageSize: 10,
        common: $event.target.value,
        filter: {
          keyTitle: this.keyTitle,
          entityType: this.entityType,
        },
      };

      let res = await this.configService.autoComplete(request);
      if (res.result.ok) {
        this.optionsComplete = [];
        if ($event) {
          res.data.map((x: any) => {
            this.optionsComplete.push(x);
          });
          console.log(this.optionsComplete);
        }
      } else {
        this.toast.error(res.result.message);
      }
    }, 500);
  }

  addColumn() {
    this.isvisibleAddColumn = true;
  }

  import() {
    this.isvisibleImport = true;
  }

  importConfirm($event: any) {
    let table = '';

    if (this.entityType == 6) {
      table = 'machine';
    }

    let res = this.http
      .post(
        `${environment.api_end_point}/api/column-properties/import-column/${table}`,
        $event
      )
      .subscribe({
        next: (res: any) => {
          this.toast.success('Import thành công');
          this.getColumn({ page: this.pageNumber, size: this.pageSize });
        },
        error: (err: any) => {
          this.toast.error(err.error.result.message);
        },
      });
  }

  async export() {
    let res = await this.configService.getColumn(this.entityType);
    if (res.result.ok) {
      res.data.map((x: any) => {
        let i = x.entryIndex;
        let title = x.keyTitle;
        let dataType;
        if (x.dataType == 1) {
          dataType = 'Integer';
        } else if (x.dataType == 2) {
          dataType = 'Float';
        } else if (x.dataType == 3) {
          dataType = 'String';
        } else if (x.dataType == 4) {
          dataType = 'Json';
        } else if (x.dataType == 5) {
          dataType = 'Date';
        } else if (x.dataType == 6) {
          dataType = 'Boolean';
        }
        let required = x.isRequired ? 'Bắt buộc' : 'Không bắt buộc';
        let hide = x.check ? 'Hiển thị' : 'Không hiển thị';
        this.columnsToExport.push({
          entryIndex: i,
          keyTitle: title,
          dataType: dataType,
          isRequired: required,
          check: hide,
        });
      });
      this.exportService.exportExcel(
        this.columnsToExport,
        this.title,
        this.header
      );
    } else {
      this.toast.error(res.result.message);
    }
  }

  childOut() {
    this.getColumn({ page: this.pageNumber, size: this.pageSize });
  }

  childOutAdd() {
    this.pageNumber = Math.ceil((this.total + 1) / this.pageSize);
    this.getColumn({ page: this.pageNumber, size: this.pageSize });
  }

  editColumn(c: any) {
    this.currentColumn = c;
    this.isvisibleEditColumn = true;
  }

  deleteColumn(c: any) {
    this.currentColumn = c;
    this.isvisibleDelete = true;
  }

  async deleteConfirm() {
    let res = await this.configService.deleteColumn(
      this.currentColumn.keyName,
      this.entityType
    );
    if (res.result.ok) {
      this.toast.success(
        'Xóa cột ' + this.currentColumn.keyTitle + ' thành công'
      );
      this.getColumn({ page: this.pageNumber, size: this.pageSize });
    } else {
      this.toast.error(res.result.message);
    }
  }

  preview() {
    this.router.navigate([`manage-config/${this.entityType}/preview`]);
  }

  id = -1;
  onResize({ width }: NzResizeEvent, i: number) {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.columnWidth[i] = width + 'px';
    });
  }

  async drop(event: CdkDragDrop<string[], string, any>) {
    if (
      event.currentIndex + 1 + (this.pageNumber - 1) * this.pageSize ==
        this.total ||
      event.previousIndex + 1 + (this.pageNumber - 1) * this.pageSize ==
        this.total
    ) {
      this.toast.warning('Trường status là cố định');
    } else {
      let prepreviousColumn = this.columns[event.previousIndex];
      prepreviousColumn.entryIndex =
        event.currentIndex + 1 + (this.pageNumber - 1) * this.pageSize;
      let res = await this.configService.updateColumn(
        prepreviousColumn.keyName,
        prepreviousColumn
      );

      if (res.result.ok) {
        this.childOut();
      } else {
        this.toast.error(res.result.message);
      }
    }
  }
}
