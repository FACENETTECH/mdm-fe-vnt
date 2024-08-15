import {
  Component,
  HostListener,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DATA_TYPE } from 'src/app/utils/constrant';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BaseService } from 'src/app/services/base.service';
import { ManageComponentService } from 'src/app/services/manage-component/manage-component.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';

@Component({
  selector: 'app-list-bom',
  templateUrl: './list-bom.component.html',
  styleUrls: ['./list-bom.component.css']
})
export class ListBomComponent {
  @ViewChild('tableBlock', { static: false }) tableBlockRef!: ElementRef;
  tableCode: string = 'work_order';
  // Dữ liệu cho cây tìm kiếm
  selectedOptions: string[] = [];
  searchTreeName: string = '';
  searchTreeOptions: {
    label: string;
    value: any;
    checked: boolean;
  }[] = [];
  nodes: any[] = [];
  columnsStatistical: any[] = [];
  dataStatistical: Record<string, number> = {};

  // Dữ liệu cho component
  expandSet = new Set<number>();
  setOfCheckedId = new Set<number>();
  checked = false;
  indeterminate = false;
  listSxnb: any[] = [];
  columns: any[] = [];
  count = 0;
  pageNumber: number = 1;
  pageSize: number = 80;
  total: number = 0;
  common: string = '';
  quotationCode: string = '';
  inforSXNB: Record<string, any> = {};
  heightTree: any;
  openTree: boolean = true;
  searchAll: boolean = false;
  heightTable: any;
  index: number = 0;
  blueprintCodeSelected: string = '';
  blueprintIdSelected?: number;
  isvisiblePopupDelete: boolean = false;
  isvisiblePopupDeleteList: boolean = false;
  widthColumn: any[] = [];
  isLoading: boolean = false;
  columnsSuggest: any[] = [];
  inforSearchSuggest: Record<string, any> = {};

  breadcrumbs = [
    {
      name: 'Quản lý BOM',
      route: `/manage-bom/list-bom`,
    },
  ];

  constructor(
    private toast: ToastrService,
    private loader: NgxUiLoaderService,
    private baseService: BaseService,
    private componentService: ManageComponentService,
    private cdr: ChangeDetectorRef
  ) {}

  listOfMapData: any[] = [
    {
      key: `1`,
      item: 'John Brown sr.',
      description: 'John Brown sr.',
      component_yield: 1,
      bom_quantity: 30,
      quantity: 60,
      unit: 'cai',
      item_source: 'item_source',
      display_name_code: 'display_name_code',
      description_sx: 'description_sx',
      display_name_sx: 'display_name_sx',
      children: [],
    },
    {
      key: `2`,
      item: 'John Brown sr.',
      description: 'John Brown sr.',
      component_yield: 1,
      bom_quantity: 30,
      quantity: 60,
      unit: 'cai',
      item_source: 'item_source',
      display_name_code: 'display_name_code',
      description_sx: 'description_sx',
      display_name_sx: 'display_name_sx',
      children: [],
    },
  ];
  mapOfExpandedData: { [key: string]: any[] } = {};

  collapse(array: any[], data: any, $event: boolean): void {
    console.log('check: ', $event);
    data.expand = $event;
    if (!$event) {
      if (data.children) {
        data.children.forEach((d: any) => {
          const target = array.find((a) => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: any): any[] {
    const stack: any[] = [];
    const array: any[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({
            ...node.children[i],
            level: node.level! + 1,
            expand: false,
            parent: node,
          });
        }
      }
    }

    return array;
  }

  visitNode(
    node: any,
    hashMap: { [key: string]: boolean },
    array: any[]
  ): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

  getChildren(
    array: any[],
    parent: any,
    i: number,
    k: number,
    $event: boolean
  ) {
    let dataChildren: any[] = dummyDataChildren;
    for (let i = 0; i < dataChildren.length; i++) {
      dataChildren[i].key = parent['key'] + '-' + (i + 1);
    }
    // data.children = dataChildren;
    // this.mapOfExpandedData[data.key] = this.convertTreeToList(data);
    // console.log(this.mapOfExpandedData);

    parent.expand = $event;
    console.log('parent: ', parent);
    if (!parent.children || parent.children.length <= 0) {
      try {
        let nodeParent: any[] = dataChildren;
        console.log('nodeParent: ', nodeParent);
        let nodeChild: any[] = [];
        nodeParent.forEach((element, index) => {
          nodeChild.push({
            ...element,
            level: parent.level + 1,
            expand: false,
            parent: parent,
          });
        });
        parent.children = [...nodeChild];
        console.log('nodeChild: ', nodeChild);
        nodeChild.forEach((item: any) => {
          this.mapOfExpandedData[this.listOfMapData[i].key] = this.insert(
            this.mapOfExpandedData[this.listOfMapData[i].key],
            ++k,
            item
          );
        });
        console.log('mapOfExpandedData: ', this.mapOfExpandedData);
      } catch (error) {
        console.error('Lỗi xảy ra: ', error);
      } finally {
      }
      // this.collapse(array, parent, $event);
    }
    this.collapse(array, parent, $event);
  }

  insert = (arr: any[], index: number, newItem: any) => [
    // part of the array before the specified index
    ...arr.slice(0, index),
    // inserted item
    newItem,
    // part of the array after the specified index
    ...arr.slice(index),
  ];

  ngOnInit(): void {
    this.listOfMapData.forEach((item) => {
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    });
    if (
      localStorage.getItem('userBehaviorBomProduction') != null &&
      localStorage.getItem('userBehaviorBomProduction') != undefined &&
      localStorage.getItem('userBehaviorBomProduction') != ''
    ) {
      let userBehaviorBomProduction = JSON.parse(
        localStorage.getItem('userBehaviorBomProduction') || ''
      );
      this.nodes = userBehaviorBomProduction.nodes;
      this.inforSearchSuggest = userBehaviorBomProduction.inforSearchSuggest;
      this.inforSXNB = userBehaviorBomProduction.inforSearchWo;
      if (this.nodes.length > 0) {
        this.getData({ page: this.pageNumber, size: this.pageSize });
      }
    } else {
      this.getData({ page: this.pageNumber, size: this.pageSize });
    }
    this.getColumn();
  }

  async getColumn() {
    this.loader.start();
    this.componentService.getColummnByTableName('bom_details').subscribe({
      next: (res) => {
        this.loader.stop();
        this.columns = [...res.data];
        // this.getSearchTreeNodes();
      },
      error: (err) => {
        this.loader.stop();
      },
    });
  }

  id = -1;
  onResize({ width }: NzResizeEvent, i: number): void {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.columns[i].width = width + 'px';
    });
    this.setWidthColumnTabBlueprint();
  }

  /**
   * Hàm lấy width các cột dummyColumnsTabBlueprintRow2
   */
  setWidthColumnTabBlueprint() {
    this.widthColumn = [];
    let widthColumns = [];
    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i].localCheck) {
        widthColumns.push(this.columns[i].width);
      }
    }
    this.widthColumn = [...widthColumns, '100px'];
  }

  getSetOfChecked(event: any) {
    this.setOfCheckedId = event;
  }

  recallData(event: any) {
    this.inforSXNB = event;
    localStorage.setItem(
      'userBehaviorBomProduction',
      JSON.stringify({
        nodes: this.nodes,
        inforSearchSuggest: this.inforSearchSuggest,
        inforSearchWo: this.inforSXNB,
      })
    );
    const searchData = {
      page: this.pageNumber,
      size: this.pageSize,
    };
    this.getData(searchData);
  }

  handleClickActionBtn(event: any) {
    console.log(event);
    switch (event.action) {
      case 'delete':
        this.openPopupDelete(event.data);
        break;
      case 'edit':
        this.openPopupAddNewWO(event.data);
        break;
    }
  }

  changeStatusTree(nodes: any) {
    this.nodes = nodes;
    this.getData({ page: this.pageNumber, size: this.pageSize });
  }

  onChangeActiveRow(data: any) {
    const elements = document.getElementsByClassName('tab-list-quoting-row');
    const elementsActive = document.querySelectorAll('.active');
    elementsActive.forEach((element) => {
      element.classList.remove('active');
    });
    elements[data.indexQuota - 1]?.classList.add('active');
    this.index = this.listSxnb.findIndex((item) => item == data);
  }

  searchSuggest(event: any) {
    this.inforSearchSuggest = event;
    localStorage.setItem(
      'userBehaviorBomProduction',
      JSON.stringify({
        nodes: this.nodes,
        inforSearchSuggest: this.inforSearchSuggest,
        inforSearchWo: this.inforSXNB,
      })
    );
    const searchData = {
      page: this.pageNumber,
      size: this.pageSize,
    };
    this.getData(searchData);
  }

  // Dưới đấy là các hàm và biến của block popup process
  isvisibleViewPDFBlueprint: boolean = false;
  isvisiblePrint: boolean = false;

  /**
   * Hàm mở popup xoá bản vẽ của thông tin đơn hàng
   */
  openPopupDelete(blueprint: any) {
    this.blueprintCodeSelected = blueprint.wo_code;
    this.blueprintIdSelected = blueprint.id;
    this.isvisiblePopupDelete = true;
  }

  /**
   * Hàm mở popup xoá nhiều bản vẽ của thông tin đơn hàng
   */
  openPopupDeleteList() {
    if (this.setOfCheckedId.size == 0 && this.index == 0) {
      this.toast.warning('Vui lòng chọn bản vẽ cần xoá!');
      return;
    }
    this.isvisiblePopupDeleteList = true;
  }

  /**
   * Hàm mở popup cập nhật thông tin công đoạn của đơn hàng sản xuất nội bộ (SXNB)
   */

  inforPoForCreateWo: Record<string, any> = {};
  isvisiblePopupAddNewWO: boolean = false;
  openPopupAddNewWO(data: any) {
    this.inforPoForCreateWo = data;
    this.isvisiblePopupAddNewWO = true;
  }

  inforWoForCreateLots: Record<string, any> = {};
  isvisiblePopupCreateLot: boolean = false;
  openPopupCreateLot() {
    this.inforWoForCreateLots = {};
    if (this.setOfCheckedId.size > 0) {
      for (let id of this.setOfCheckedId) {
        for (let i = 0; i < this.listSxnb.length; i++) {
          if (this.listSxnb[i].id == id) {
            this.inforWoForCreateLots = { ...this.listSxnb[i] };
            break;
          }
        }
        if (this.inforWoForCreateLots.hasOwnProperty('id')) {
          break;
        }
      }
      this.isvisiblePopupCreateLot = true;
    } else {
      this.toast.warning('Vui lòng chọn bản ghi cần tạo LOT!');
    }
  }

  widthContent: string = '100%';

  loadingAfterFinish(event: boolean) {
    if (event) {
      this.getData({ page: this.pageNumber, size: this.pageSize });
    }
  }

  /**
   * Hàm lấy thông tin danh sách các phiếu báo giá
   * @param page
   */
  getData(page: { page: number; size: number }) {
    this.index = 0;
    this.isLoading = true;
    let request = {
      pageNumber: page.page - 1,
      pageSize: page.size,
      common: this.common,
      filter: {
        ...this.inforSXNB,
        ...this.inforSearchSuggest,
      },
      sortOrder: 'DESC',
      sortProperty: 'created_at',
      searchOptions: [],
      searchTree: this.nodes,
    };
    this.componentService
      .getDataDynamicTable(this.tableCode, request)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.listSxnb = res.data;
          let grouped: any = {};
          let indexRecord = 1;

          for (let i = 0; i < this.listSxnb.length; i++) {
            this.listSxnb[i]['isParent'] = false;
            let item = this.listSxnb[i];
            let quotaCode = item.wo_code;

            if (grouped[quotaCode]) {
              grouped[quotaCode].push(item);
            } else {
              grouped[quotaCode] = [item];
            }
          }

          for (let gr in grouped) {
            grouped[gr].sort((a: any, b: any) => {
              return a.id - b.id;
            });
          }

          let array: any[] = [];
          for (const property in grouped) {
            let obj = {
              id: null,
              wo_code: property,
              isParent: true,
              keyName: 'wo_code',
              keyTitle: '',
            };
            array.push(obj);
            array = [array, grouped[property]].reduce(
              (result, arr) => result.concat(arr),
              []
            );
          }
          for (let i = 0; i < array.length; i++) {
            if (!array[i].isParent) {
              array[i]['indexRecord'] = indexRecord++;
            }
          }
          this.listSxnb = array;
          this.total = res.dataCount;
        },
        error: (err) => {
          this.isLoading = false;
          this.toast.error(err.error.result.message);
        },
      });
  }

  // Làm tròn giá trị tăng lên đến hàng nghìn gần nhất
  roundToThousands(value: any): number {
    //convert string to number
    value = Number(value);
    return Math.round(value / 1000) * 1000;
  }

  /**
   * Hàm xác nhận xoá thông tin bản vẽ
   */
  deleteRecordSXNB() {
    if (
      this.blueprintIdSelected != null &&
      this.blueprintIdSelected != undefined
    ) {
      this.loader.start();
      this.componentService
        .deleteRecordById(this.tableCode, this.blueprintIdSelected)
        .subscribe({
          next: (res) => {
            this.toast.success(res.result.message);
            this.getData({ page: this.pageNumber, size: this.pageSize });
            this.loader.stop();
          },
          error: (err) => {
            this.toast.error(err.error.result.message);
            this.loader.stop();
          },
        });
    }
  }

  /**
   * Hàm xác nhận xoá thông tin của nhiều bản vẽ
   */
  deleteListRecordSXNB() {
    this.loader.start();
    let request: any = [];
    if (this.setOfCheckedId.size > 0) {
      this.setOfCheckedId.forEach((id) => {
        request.push(id);
      });
    } else {
      request.push(this.listSxnb[this.index].id);
    }
    this.componentService
      .deleteListRecordByListId('po_blueprint', request)
      .subscribe({
        next: (res) => {
          this.toast.success(res.result.message);
          this.getData({ page: this.pageNumber, size: this.pageSize });
          this.loader.stop();
        },
        error: (err) => {
          this.toast.error(err.error.result.message);
          this.loader.stop();
        },
      });
  }

  /**
   * Đây là hàm xử lý sự kiện thay đổi vị trí hàng trong bảng
   * @param event : là thông tin về hàng được thay đổi vị trí
   */
  async drop(event: CdkDragDrop<string[], string, any>) {
    moveItemInArray(this.listSxnb, event.previousIndex, event.currentIndex);
  }

  isvisiblePopupCopyBlueprint: boolean = false;
  openPopupCopyBlueprint() {
    if (this.setOfCheckedId.size > 0) {
      this.isvisiblePopupCopyBlueprint = true;
    } else {
      this.toast.warning('Vui lòng chọn bản vẽ cần sao chép!');
    }
  }

  /**
   * Hàm kiểm tra tài khoản có quyền để thực hiện action hay không
   * @param roles các quyền cần kiểm tra trong danh sách quyền của tài khoản
   * @returns
   */
  isCheckRoles(roles: any) {
    if (this.baseService.checkAuthentication(['admin_business'])) {
      return true;
    } else {
      return this.baseService.checkAuthentication(roles);
    }
  }

  ngOnDestroy() {
    localStorage.removeItem('currentRouter');
  }

  // CÁC HÀM PHÍM TẮT CỦA HỆ THỐNG VÀ SỰ KIỆN CLICK, DBCLICK TRÊN ROW
  onDbClickOnRow(inforSXNB: any) {}

  @HostListener('document:keydown', ['$event'])
  onTableKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      event.stopPropagation();
      if (event.key === 'ArrowUp') {
        this.index -= 1;
        if (this.index == 0) this.index = this.listSxnb.length - 1;
        if (this.listSxnb[this.index].isParent) this.index -= 1;
        this.onChangeActiveRow(this.listSxnb[this.index]);
      }
      if (event.key === 'ArrowDown') {
        this.index += 1;
        if (this.index == this.listSxnb.length) this.index = 1;
        if (this.listSxnb[this.index].isParent) this.index += 1;
        this.onChangeActiveRow(this.listSxnb[this.index]);
      }
      let tableElement = document.querySelector(
        'nz-table-inner-scroll.ant-table-container .ant-table-body'
      );
      tableElement?.scrollTo(0, this.index * 32 - this.heightTable / 2);
    }
  }

  @HostListener('document:keydown.control.s', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt
    event.stopPropagation(); // Ngăn chặn sự kiện lan truyền lên các thành phần khác
  }

  @HostListener('document:keydown.shift.n', ['$event'])
  onOpenFormAddNew(event: KeyboardEvent): void {
    event.preventDefault(); // Ngăn chặn hành vi mặc địnfh của trình duyệt
    event.stopPropagation(); // Ngăn chặn sự kiện lan truyền lên các thành phần khác

    if (this.isCheckRoles(['vntvn_qs_sale'])) {
      // Gọi hàm mở popup thêm mới
    } else {
      this.toast.warning(
        'Tài khoản của bạn không có quyền thực hiện chức năng này!'
      );
    }
  }

  @HostListener('document:keydown.shift.d', ['$event'])
  onOpenCopy(event: KeyboardEvent): void {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt
    event.stopPropagation(); // Ngăn chặn sự kiện lan truyền lên các thành phần khác
  }

  @HostListener('document:keydown.shift.u', ['$event'])
  onOpenFormUpdate(event: KeyboardEvent): void {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt
    event.stopPropagation(); // Ngăn chặn sự kiện lan truyền lên các thành phần khác

    if (this.setOfCheckedId.size > 0) {
      let idQuotation = 0;
      let inforSXNB: any = {};
      for (const item of this.setOfCheckedId) {
        idQuotation = item;
      }

      if (idQuotation != 0) {
        inforSXNB = this.listSxnb.find((item) => item.id === idQuotation);
      }

      if (inforSXNB != undefined) {
        // Gọi hàm mở popup cập nhật
      }
    } else {
      this.toast.warning('Vui lòng chọn bản ghi cần cập nhật!');
    }
  }

  @HostListener('document:keydown.delete', ['$event'])
  onOpenFormDelete(event: KeyboardEvent): void {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt
    event.stopPropagation(); // Ngăn chặn sự kiện lan truyền lên các thành phần khác

    if (this.setOfCheckedId.size > 0) {
      this.openPopupDeleteList();
    } else {
      this.toast.warning('Vui lòng chọn các bản ghi cần xoá!');
    }
  }

  @HostListener('document:keydown.shift.c', ['$event'])
  onOpenFormCopy(event: KeyboardEvent): void {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt
    event.stopPropagation(); // Ngăn chặn sự kiện lan truyền lên các thành phần khác

    this.openPopupCopyBlueprint();
  }

  protected readonly dataType = DATA_TYPE;
}

const dummyDataChildren = [
  {
    item: 'John Brown sr 1.',
    description: 'John Brown sr 1.',
    component_yield: 1,
    bom_quantity: 2320,
    quantity: 63220,
    unit: 'cai',
    item_source: 'item_source',
    display_name_code: 'display_name_code',
    description_sx: 'description_sx',
    display_name_sx: 'display_name_sx',
    children: [],
  },
  {
    item: 'John Brown sr 2.',
    description: 'John Brown sr 2.',
    component_yield: 1,
    bom_quantity: 21,
    quantity: 60211,
    unit: 'cai',
    item_source: 'item_source',
    display_name_code: 'display_name_code',
    description_sx: 'description_sx',
    display_name_sx: 'display_name_sx',
    children: [],
  },
];
