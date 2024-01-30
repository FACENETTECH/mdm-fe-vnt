import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

constructor() { }

fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
fileExtension = '.xlsx';

 exportExcel(data: any[], fileName: string, headers: any[]): void {

  const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(fileName);

        // const headers = Object.keys(data[0]);
        worksheet.addRow(headers);
        data.forEach((item) => {
          const row:any = Object.values(item);
          // headers.forEach((header) => {
          //   row.push(item[header]);
          // });
          worksheet.addRow(row);
        });
        workbook.xlsx.writeBuffer().then((buffer: any) => {
          const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          saveAs(blob, `${fileName}.xlsx`);
        });
      }

      exportExcelTemplate(data: any, fileName: string): void {

        const workbook = new ExcelJS.Workbook();
              const worksheet = workbook.addWorksheet(fileName);
              worksheet.addRow(data);


              workbook.xlsx.writeBuffer().then((buffer: any) => {
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, `${fileName}.xlsx`);
              });
            }

}


