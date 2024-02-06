import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-tree',
  templateUrl: './search-tree.component.html',
  styleUrls: ['./search-tree.component.css']
})
export class SearchTreeComponent {
  allChecked = false;
  indeterminate = false;

  @Input() searchTreeName: string = '';

  // Lưu trữ giá trị cây tìm kiếm
  @Input() searchOptionList: any[] = [];

  @Output() selectedOptions = new EventEmitter<string[]>();

  /**
   * Hàm check hoặc uncheck tất cả option cây tìm kiếm
   */
  updateAllChecked(): void {
    this.indeterminate = false;
    let selected:string[] = [];
    if (this.allChecked) {
      this.searchOptionList =this.searchOptionList.map(item => {
        item.checked = true;
        selected.push(item.value);
        return item;
      });
    } else {
      this.searchOptionList = this.searchOptionList.map(item => {
        item.checked = false;
        return item;
      });
    }
    this.selectedOptions.emit(selected);
  }

  /**
   * Hàm thay đổi trạng thái 1 checkbox
   */
  updateCheckBox(): void {
    let selected: string[] = [];
    let notAllChecked: boolean = false;
    this.searchOptionList =this.searchOptionList.map(item => {
      if (item.checked == true) {
        selected.push(item.value);
      } else {
        notAllChecked = true;
      }
      return item;
    });
    this.allChecked = !notAllChecked;
    this.selectedOptions.emit(selected);
  }
}
