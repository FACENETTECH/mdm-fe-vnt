import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BaseService } from 'src/app/services/base.service';
import { ManageComponentService } from 'src/app/services/manage-component/manage-component.service';
import { ConfigService } from 'src/app/services/manage-config/config.service';
import { DATA_TYPE, ROLE_NAME } from 'src/app/utils/constrant';

@Component({
  selector: 'app-popup-create-or-update-bom',
  templateUrl: './popup-create-or-update-bom.component.html',
  styleUrls: ['./popup-create-or-update-bom.component.css'],
})
export class PopupCreateOrUpdateBomComponent {
  @Input() typePopup: number = 0;
  @Input() isvisible: boolean = true;
  @Input() inforComponent: any;
  @Input() inforBOM: any = {};
  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() isvisibleUpdate: EventEmitter<boolean> = new EventEmitter();
  columns: any[] = [];
  columnsBomDetail: any[] = [];
  id: string = '';
  valueTypeParam: any = []; // Lưu trữ các giá trị của những trường có type là param
  requestAddNewParam: any;
  isVisibleManageParam: boolean = false;
  tableCode: string = 'bom';
  showErrorMachineType: boolean = false;
  valueSelectBox: any = []; // Lưu trữ các giá trị của những trường có type là select box
  listEntityByRelation: any[] = [];
  optionsRelation: any[] = [];
  columnRelation?: string;
  listChildrenBom: any[] = [];
  columnsStage: any[] = [];
  listStageOfBom: any[] = [];
  technologyProcessCode: string = '';
  listMaterial: any[] = [];
  listStage: any[] = [];
  isvisiblesubmit: boolean = false;
  listStageDeleteOfBom: any[] = [];

  constructor(
    private loader: NgxUiLoaderService,
    private manageService: ManageComponentService,
    private toast: ToastrService,
    private configService: ConfigService,
    private baseService: BaseService,
    private keyCloak: KeycloakService,
  ) {}

  ngOnInit() {
    this.getColumns();
    this.getColumnsStage();
    this.getColumnsBomDetail();
    this.getAllEntity();
    this.getDataMaterials();
    this.getListStage();
    if (Object.entries(this.inforBOM).length === 0) {
    } else {
      this.getDataStages();
      this.getListBomDetailOfBom();
    }
  }

  checkAction: boolean = false;
  handleCancel() {
    if (this.checkAction) {
      this.isvisible = true;
    } else {
      this.isvisibleChange.emit(false);
    }
  }

  getColumns() {
    this.loader.start();
    this.manageService.getColummnByTableName(this.tableCode).subscribe({
      next: (res) => {
        this.loader.stop();
        this.columns = [...res.data];
      },
      error: (err) => {
        this.loader.stop();
      },
    });
  }

  getColumnsBomDetail() {
    this.loader.start();
    this.manageService.getColummnByTableName('bom_detail').subscribe({
      next: (res) => {
        this.loader.stop();
        this.columnsBomDetail = [...res.data];
      },
      error: (err) => {
        this.loader.stop();
      },
    });
  }

  getColumnsStage() {
    this.loader.start();
    this.manageService
      .getColummnByTableName('technology_process_operation')
      .subscribe({
        next: (res) => {
          this.loader.stop();
          this.columnsStage = [...res.data];
          // this.getSearchTreeNodes();
        },
        error: (err) => {
          this.loader.stop();
        },
      });
  }

  getListBomDetailOfBom() {
    let request = {
      pageNumber: 0,
      pageSize: 0,
      common: null,
      filter: {
        id: this.inforBOM['id'],
      },
      sortOrder: 'DESC',
      sortProperty: 'created_at',
      searchOptions: [],
    };
    this.loader.start();
    this.manageService.getAllBomDetail(request).subscribe({
      next: (res) => {
        this.loader.stop();
        this.listChildrenBom = res.data;
      },
      error: (err) => {
        this.loader.stop();
        this.toast.error(err.error.result.message);
      },
    });
  }

  getDataStages() {
    let technologyProcessCode = this.listStage.find(
      (record) => record.id == this.inforBOM['mdm_technology_process_id']
    );
    if (technologyProcessCode) {
      this.technologyProcessCode =
        technologyProcessCode['technology_process_code'];
      this.loader.start();
      let request = {
        pageNumber: 0,
        pageSize: 0,
        common: '',
        filter: {
          technology_process_code:
            technologyProcessCode['technology_process_code'],
        },
        sortOrder: 'DESC',
        sortProperty: 'index',
        searchOptions: [],
      };
      this.manageService
        .getDataDynamicTable('technology_process_operation', request)
        .subscribe({
          next: (res) => {
            this.loader.stop();
            this.listStageOfBom = [...res.data];
            if (this.listStageOfBom.length > 0) {
              this.listStageOfBom.sort(
                (a, b) => a['operation_order'] - b['operation_order']
              );
              this.listStageOfBom.forEach((stage) => {
                stage['isNew'] = false;
              });
            }
            // this.getSearchTreeNodes();
          },
          error: (err) => {
            this.loader.stop();
          },
        });
    }
  }

  getDataMaterials() {
    let request = {
      pageNumber: 0,
      pageSize: 0,
      common: '',
      filter: {},
      sortOrder: 'DESC',
      sortProperty: 'index',
      searchOptions: [],
    };
    this.manageService.getDataDynamicTable('material', request).subscribe({
      next: (res) => {
        this.listMaterial = res.data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getListStage() {
    let request = {
      pageNumber: 0,
      pageSize: 0,
      common: '',
      filter: {},
      sortOrder: 'DESC',
      sortProperty: 'index',
      searchOptions: [],
    };
    this.manageService
      .getDataDynamicTable('technology_process', request)
      .subscribe({
        next: (res) => {
          this.listStage = res.data;
          console.log(this.listStage);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  formatNumber(input: any) {
    // Lấy giá trị đang nhập từ input
    let value = input.value;

    // Loại bỏ tất cả các ký tự không phải chữ số hoặc dấu .
    value = value.replace(/[^0-9.]/g, '');

    // Convert string thành number
    const numberValue = Number.parseFloat(value);
    if (value[value.length - 1] != '.' && !isNaN(numberValue)) {
      // Định dạng lại giá trị với dấu phẩy
      const formattedValue = numberValue.toLocaleString('en-US', {
        useGrouping: true,
        maximumSignificantDigits: 20,
      });
      // Gán giá trị đã được định dạng lại vào input
      input.value = formattedValue;
    }
  }

  checkMachine: Record<string, any> = {};

  checkValid() {
    let charSpecial = /[&@₫()?!/"#%^*+=\|~<>$¥€?!']/;

    this.columns.map((x: any) => {
      if (
        x.isRequired == true &&
        (this.inforBOM[x.keyName] == null || this.inforBOM[x.keyname] == '')
      ) {
        this.checkMachine[x.keyName] = `Không được bỏ trống ${x.keyTitle}`;
      } else if (
        x.keyName.includes('Code') &&
        charSpecial.test(this.inforBOM[x.keyName])
      ) {
        this.checkMachine[
          x.keyName
        ] = `Trường ${x.keyTitle} chứa ký tự đặc biệt`;
      } else {
        this.checkMachine[x.keyName] = '';
      }
    });
  }

  /**
   * Hàm gọi API và xử lý dữ liệu option cho select box với trường có đơn vị tính
   */
  handleOpenChangeUnit(data: any, column: any) {
    if (data) {
      if (column.note != '' && column.note != null) {
        this.manageService.getParamsByCode(column.note).subscribe({
          next: (res) => {
            this.valueTypeParam = res.data;
          },
          error: (err) => {
            this.toast.error(err.error.result.message);
          },
        });
      } else {
        this.toast.warning('Không tìm thấy tên cột!');
      }
    }
  }

  parser = (value: any) => value.replace(/\$\s?|(,*)/g, '');
  formatter = (value: any): string => {
    let result = `${value}`.replace(',', '');
    result = `${result}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return result;
  };

  addItem(isParam: any, column: any): void {
    if (isParam) {
      this.requestAddNewParam = {
        tableName: this.tableCode,
        columnName: column.keyName,
      };
    } else {
      this.requestAddNewParam = {
        paramCode: column.note,
      };
    }
    this.isVisibleManageParam = true;
  }

  /**
   * Hàm gọi API và xử lý dữ liệu option cho select box
   */
  handleOpenChangeDataTypeParam(data: any, column: any) {
    if (data) {
      this.manageService
        .getParamByTableNameAndColumnName(column.tableName, column.keyName)
        .subscribe({
          next: (res) => {
            this.valueSelectBox = res.data;
          },
          error: (err) => {
            this.toast.error(err.error.result.message);
          },
        });
    }
  }

  /**
   * Hàm gọi API và xử lý dữ liệu option cho select box với trường có kiểu dữ liệu là relation
   */
  handleOpenChangeRelation(event: any, column: any) {
    if(event) {
      // this.columnRelation = '';
      if (this.listEntityByRelation.length > 0) {
        let tableCode = '';
        console.log('check: ', this.listEntityByRelation)
        for (let i = 0; i < this.listEntityByRelation.length; i++) {
          if (this.listEntityByRelation[i].name == column.relateTable) {
            console.log('check')
            tableCode = this.listEntityByRelation[i].name;
            break;
          }
        }
        console.log(tableCode)
        if (tableCode != '') {
          let request = {
            pageNumber: 0,
            pageSize: 0,
            common: '',
            filter: {},
            sortOrder: 'DESC',
            sortProperty: 'index',
            searchOptions: [],
          };
          this.manageService.getDataDynamicTable(tableCode, request).subscribe({
            next: (res) => {
              this.optionsRelation = res.data;
              this.manageService.getColummnByTableName(tableCode).subscribe({
                next: (res) => {
                  for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].keyName == column.relateColumn) {
                      this.columnRelation = res.data[i].keyName;
                      break;
                    }
                  }
                  console.log(this.columnRelation)
                },
              });
            },
            error: (err) => {
              this.toast.error(err.error.result.message);
            },
          });
        }
      }
    }
  }

  /**
   * Hàm gọi API và xử lý dữ liệu option cho select box với trường có kiểu dữ liệu là relation
   */
  handleOpenChangeOperationCode(event: any, columnName: string) {
    // this.columnRelation = '';
    if (event) {
      if (this.listEntityByRelation.length > 0) {
        let tableCode = '';
        for (let i = 0; i < this.listEntityByRelation.length; i++) {
          if (this.listEntityByRelation[i].name == 'operation') {
            tableCode = this.listEntityByRelation[i].name;
          }
        }
        if (tableCode != '') {
          let request = {
            pageNumber: 0,
            pageSize: 0,
            common: '',
            filter: {},
            sortOrder: 'DESC',
            sortProperty: 'index',
            searchOptions: [],
          };
          this.manageService.getDataDynamicTable(tableCode, request).subscribe({
            next: (res) => {
              this.optionsRelation = res.data;
              this.manageService.getColummnByTableName(tableCode).subscribe({
                next: (res) => {
                  for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].keyName == columnName) {
                      this.columnRelation = res.data[i].keyName;
                      break;
                    }
                  }
                },
              });
            },
            error: (err) => {
              this.toast.error(err.error.result.message);
            },
          });
        }
      }
    }
  }

  handleChangeValueOperationCode(event: any, index: number) {
    let operation = this.optionsRelation.find(
      (record) => record[this.columnRelation!] == event
    );
    this.columnsStage.forEach((column) => {
      this.listStageOfBom[index][column.keyName] = operation[column.keyName];
    });
    this.listStageOfBom[index]['operation_order'] = this.listStageOfBom.length;
    this.listStageOfBom[index]['technology_process_code'] =
      this.technologyProcessCode;
  }

  handleChangeValueMaterialId(event: any, index: number) {
    let record = this.listMaterial.find((record) => record['id'] == event);
    console.log('changeValueMaterialId: ', record);
    this.columnsBomDetail.forEach((column) => {
      if (column.keyName != 'material_id') {
        this.listChildrenBom[index][column.keyName] = record[column.keyName];
      }
    });
  }

  /**
   * Hàm lấy ra tất cả bảng trong database
   */
  getAllEntity() {
    this.listEntityByRelation = [];
    this.configService.getAllCategory().subscribe({
      next: (res) => {
        this.listEntityByRelation = this.getAllByIsEntity(res.data);
        // for (let i = 0; i < res.data.length; i++) {
        //   if (res.data[i].isEntity) {
        //     this.listEntityByRelation.push(res.data[i]);
        //   }
        //   if (res.data[i].children.length > 0) {
        //     for (let j = 0; j < res.data[i].children.length; j++) {
        //       if (res.data[i].children[j].isEntity) {
        //         this.listEntityByRelation.push(res.data[i].children[j]);
        //       }
        //     }
        //   }
        // }
      },
      error: (err) => {
        this.toast.error(err.error.result.message);
      },
    });
  }

  getAllByIsEntity(data : any){
    let result : any = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].isEntity) {
        result.push(data[i]);
      }
      if (data[i].children.length > 0) {
        result = result.concat(this.getAllByIsEntity(data[i].children));
      }
    }
    return result;
  }

  addNewRow() {
    let record: Record<string, any> = {};
    this.columns.forEach((col) => {
      record[col.name] = null;
    });
    this.listChildrenBom.push({
      ...record,
    });
  }

  deleteRow(data: any, index: number) {
    this.listChildrenBom.splice(index, 1);
  }

  addNewRowTableStage() {
    let record: Record<string, any> = {};
    this.columnsStage.forEach((col) => {
      record[col.name] = null;
    });
    record['isNew'] = true;
    this.listStageOfBom.push({
      ...record,
    });
  }

  deleteRowTableStage(data: any, index: number) {
    if (data.hasOwnProperty('id')) {
      this.listStageDeleteOfBom.push(data.id);
    }
    this.listStageOfBom.splice(index, 1);
    this.listStageOfBom.forEach((stage, index) => {
      stage['operation_order'] = index + 1;
    });
  }

  submitDemo() {
    this.isvisiblesubmit = true;
  }

  async submit() {
    for(let i = 0; i < this.columns.length; i++) {
      if(this.columns[i].dataType == this.dataType.RELATION) {
        if(this.inforBOM[this.columns[i].keyName] != null && this.inforBOM[this.columns[i].keyName] != '') {
          this.inforBOM[this.columns[i].keyName] = this.inforBOM[this.columns[i].keyName].id;
        }
      }
    }
    if (this.typePopup == this.TYPE_POPUP.copy || this.typePopup == this.TYPE_POPUP.create) {
      if (this.typePopup == this.TYPE_POPUP.copy) {
        this.inforBOM['id'] = undefined;
      }
      this.loader.start();
      this.manageService.createOrUpdateBom(this.inforBOM).subscribe({
        next: (res) => {
          this.loader.stop();
          this.toast.success(res.result.message);
          console.log(res);
          if (res.data) {
            this.listChildrenBom.forEach((bom) => {
              bom['bom_id'] = res.data.id;
              this.columnsBomDetail.forEach((col) => {
                if (
                  col.dataType == this.dataType.NUMBER &&
                  col.keyName != 'material_id'
                ) {
                  bom[col.keyName] = Number(bom[col.keyName]);
                }
                if (
                  col.dataType == this.dataType.RELATION &&
                  bom[col.keyName] != null && bom[col.keyName] != ''
                ) {
                  bom[col.keyName] = bom[col.keyName].id;
                }
              });
            });
            console.log(this.listChildrenBom);
            this.loader.start();
            this.manageService
              .createOrUpdateBomDetail(this.listChildrenBom)
              .subscribe({
                next: (response) => {
                  this.loader.stop();
                  this.toast.success(response.result.message);
                  this.isvisible = false;
                  this.isvisibleChange.emit(this.isvisible);
                  this.isvisibleUpdate.emit(true);
                  this.updateInforStage();
                },
                error: (error) => {
                  this.loader.stop();
                  this.toast.error(error.error.result.message);
                },
              });
          }
        },
        error: (err) => {
          this.loader.stop();
          this.toast.error(err.error.result.message);
        },
      });
    }
    if (this.typePopup == this.TYPE_POPUP.update) {
      this.loader.start();
      this.manageService.updateInforBom(this.inforBOM).subscribe({
        next: (res) => {
          this.loader.stop();
          this.toast.success(res.result.message);
          console.log(res);
          if (res.data) {
            this.listChildrenBom.forEach((bom) => {
              bom['bom_id'] = res.data.id;
              this.columnsBomDetail.forEach((col) => {
                if (
                  col.dataType == this.dataType.NUMBER &&
                  col.keyName != 'material_id'
                ) {
                  bom[col.keyName] = Number(bom[col.keyName]);
                }
                if (
                  col.dataType == this.dataType.RELATION &&
                  bom[col.keyName] != null && bom[col.keyName] != ''
                ) {
                  bom[col.keyName] = bom[col.keyName].id;
                }
              });
            });
            console.log(this.listChildrenBom);
            this.loader.start();
            this.manageService
              .createOrUpdateBomDetail(this.listChildrenBom)
              .subscribe({
                next: (response) => {
                  this.loader.stop();
                  this.toast.success(response.result.message);
                  this.isvisible = false;
                  this.isvisibleChange.emit(this.isvisible);
                  this.isvisibleUpdate.emit(true);
                  this.updateInforStage();
                },
                error: (error) => {
                  this.loader.stop();
                  this.toast.error(error.error.result.message);
                },
              });
          }
        },
        error: (err) => {
          this.loader.stop();
          this.toast.error(err.error.result.message);
        },
      });
    }
  }

  updateInforStage() {
    let requestAddNew = [];
    let requestUpdate = [];
    for (let i = 0; i < this.listStageOfBom.length; i++) {
      if (this.listStageOfBom[i].isNew) {
        const copiedObject = Object.assign({}, this.listStageOfBom[i]);
        delete copiedObject.isNew;
        requestAddNew.push(copiedObject);
      } else {
        const copiedObject = Object.assign({}, this.listStageOfBom[i]);
        delete copiedObject.isNew;
        requestUpdate.push(copiedObject);
      }
    }
    let request = {
      toDeleteIds: this.listStageDeleteOfBom,
      toUpdateEntities: requestUpdate,
      toCreateEntities: requestAddNew,
    };
    this.manageService
      .updateListInforRecordByIdV2('technology_process_operation', request)
      .subscribe({
        next: (response) => {
          this.listStageDeleteOfBom = [];
        },
        error: (error) => {
          console.error(error.error.result.message);
        },
      });
  }

  handleChangeNumber($event: any, column: any) {
    if (column.formula) {
      const formulas = column.formula.split(',');

      formulas.forEach((formula: any) => {
        const formulaParts = formula.split('=');
        const resultField = formulaParts[1].trim();
        const expression = formulaParts[0].trim();

        const expressionWithValues = expression.replace(/(\w+)/g, (match: any) => {
          return this.convertStringToNumber(this.inforBOM[match]);
        });
        this.inforBOM[resultField] = Number(eval(expressionWithValues));
      });
    }
  }
  
  convertStringToNumber(value: any): number {
    if (value == null || value == '' || value == undefined) {
      return 0;
    }
    let cleanedValue = value.replace(/,/g, '');
    return Number(cleanedValue);
  }

  ngOnDestroy() {}

  /**
   * Hàm kiểm tra tài khoản có quyền để thực hiện action hay không
   * @param role
   * @returns
   */
  isCheckRoles(action: string) {
    if (this.baseService.isAuthorized('admin_business')) {
      return true;
    } else {
      let tenant = '';
      if (
        this.keyCloak.getKeycloakInstance().idTokenParsed != null &&
        this.keyCloak.getKeycloakInstance().idTokenParsed != undefined
      ) {
        tenant = this.keyCloak
          .getKeycloakInstance()
          .idTokenParsed!['groups'][0].slice(1);
      }
      let role = tenant + '_mdm_' + this.tableCode + '_' + action;
      return this.baseService.isAuthorized(role);
    }
  }

  protected readonly dataType = DATA_TYPE;
  protected readonly TYPE_POPUP = typePopup;
  protected readonly roleName = ROLE_NAME;
}

const typePopup = {
  create: 0,
  update: 1,
  copy: 2,
};
