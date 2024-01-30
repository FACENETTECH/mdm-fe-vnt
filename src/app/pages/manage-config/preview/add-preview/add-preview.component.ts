import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfigService } from 'src/app/services/manage-config/config.service';

@Component({
  selector: 'app-add-preview',
  templateUrl: './add-preview.component.html',
  styleUrls: ['./add-preview.component.css'],
})
export class AddPreviewComponent implements OnInit {
  @Input() isvisible: boolean = false;
  @Input() entityType: number = 0;
  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();

  constructor(private configService: ConfigService) {}
  columns: any[] = [];
  inforMachine: Record<string, any> = {};

  async ngOnInit() {
    let res = await this.configService.getColumn(this.entityType);
    this.columns = res.data;
  }

  checkMachine: Record<string, any> = {};

  checkValid() {
    this.columns.map((x: any) => {
      if (
        x.isRequired == true &&
        (this.inforMachine[x.keyName] == null ||
          this.inforMachine[x.keyname] == '')
      ) {
        this.checkMachine[x.keyName] == `Không được bỏ trống ${x.keyTitle}`;
      }
    });
  }

  handleCancel() {
    this.isvisibleChange.emit(false);
  }

  submit() {
    this.isvisibleChange.emit(false);
  }
}
