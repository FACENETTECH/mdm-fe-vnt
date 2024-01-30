import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'src/app/services/manage-config/config.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css'],
})
export class PreviewComponent implements OnInit {
  constructor(
    private configService: ConfigService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private toast: ToastrService,
    private loader: NgxUiLoaderService
  ) {
    this.router.events.subscribe((e: Event) => {
      if (e instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
  }

  breadcrumbs: any[] = [];

  columns: any[] = [];

  entityType: number = 0;
  listData: any[] = [];

  title: string = '';

  ngOnInit() {
    this.loader.start();
    this.entityType = this.actRoute.snapshot.params['id'];

    this.getData();
    if (this.entityType == 1) {
      this.title = 'sider.stageManagement';
    } else if (this.entityType == 2) {
      this.title = 'sider.supplierManagement';
    } else if (this.entityType == 3) {
      this.title = 'công việc';
    } else if (this.entityType == 4) {
      this.title = 'sider.errorManagement';
    } else if (this.entityType == 5) {
      this.title = 'nhóm lỗi';
    } else if (this.entityType == 6) {
      this.title = 'sider.machineManagement';
    } else if (this.entityType == 7) {
      this.title = 'dây chuyền';
    } else if (this.entityType == 11) {
      this.title = 'Quản lý nhân viên';
    } else if (this.entityType == 12) {
      this.title = 'nhóm tổ';
    }
    this.breadcrumbs = [
      {
        name: 'Quản lý cấu hình',
        route: '',
      },
      {
        name: `${this.title}`,
        route: `/manage-config/${this.entityType}`,
      },
    ];
    this.loader.stop();
  }

  total: number = 100;
  pageSize: number = 10;
  pageNumber: number = 1;

  isvisibleAdd: boolean = false;

  async getData() {
    let res = await this.configService.getColumn(this.entityType);
    if (res.result.ok) {
      this.columns = res.data.filter((x: any) => {
        return x.check;
      });
    } else {
      this.toast.error(res.result.message);
    }
  }

  back() {
    this.router.navigate([`manage-config/${this.entityType}`]);
  }

  add() {
    this.isvisibleAdd = true;
  }
}
