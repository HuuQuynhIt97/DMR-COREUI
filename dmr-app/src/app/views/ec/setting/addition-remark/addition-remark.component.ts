import { BaseComponent } from 'src/app/_core/_component/base.component';
import { ISupplier } from '../../../../_core/_model/Supplier';
import { IngredientService } from '../../../../_core/_service/ingredient.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { AdditionService } from 'src/app/_core/_service/addition.service';

@Component({
  selector: 'app-addition-remark',
  templateUrl: './addition-remark.component.html',
  styleUrls: ['./addition-remark.component.scss']
})
export class AdditionRemarkComponent extends BaseComponent implements OnInit {

  public pageSettings = { pageCount: 20, pageSizes: true, currentPage: 1, pageSize: 10 };
  public toolbarOptions = ['ExcelExport', 'Add', 'Edit', 'Delete', 'Cancel', 'Search'];
  public editSettings = { showDeleteConfirmDialog: false, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' };
  public data: object[];
  filterSettings = { type: 'Excel' };
  modalRemark = {
    id: 0,
    content: ''
  };
  @ViewChild('grid') grid: GridComponent;
  public textGlueLineName = 'Select ';
  public remark: object[] = [];
  public setFocus: any;
  constructor(
    private alertify: AlertifyService,
    public modalService: NgbModal,
    private ingredientService: IngredientService,
    private additionService: AdditionService,
    private route: ActivatedRoute,
  ) { super(); }

  ngOnInit() {
    // this.Permission(this.route);
    this.getAllRemark();
  }

  getAllRemark() {
    this.additionService.getAllRemark().subscribe(res => {
      this.remark = res;
    });
  }
  actionBegin(args) {
    if (args.requestType === 'save') {
      if (args.action === 'edit') {
        this.modalRemark.id = args.data.id || 0;
        this.modalRemark.content = args.data.content;
        this.update(this.modalRemark);
      }
      if (args.action === 'add') {
        if (args.data.content) {
          this.modalRemark.id = 0;
          this.modalRemark.content = args.data.content;
          this.add(this.modalRemark);
        } else {
          args.cancel = true;
        }
      }
    }
    if (args.requestType === 'delete') {
      this.delete(args.data[0]);
    }
  }
  toolbarClick(args): void {
    switch (args.item.text) {
      /* tslint:disable */
      case 'Excel Export':
        this.grid.excelExport();
        break;
      /* tslint:enable */
      default:
        break;
    }
  }
  actionComplete(e: any): void {
    if (e.requestType === 'add') {
      (e.form.elements.namedItem('content') as HTMLInputElement).focus();
      (e.form.elements.namedItem('id') as HTMLInputElement).disabled = true;
    }
  }
  onDoubleClick(args: any): void {
    this.setFocus = args.column;  // Get the column from Double click event
  }
  delete(data) {
    this.alertify.delete("Delete Remark",'Are you sure you want to delete this Remark "' + data.content + '" ?')
    .then((result) => {
      if (result) {
        this.additionService.deleteRemark(data.id).subscribe(() => {
          this.alertify.success("Remark has been deleted");
          this.getAllRemark();
        });
      }
    })
    .catch((err) => {
      this.getAllRemark();
      this.grid.refresh();
    });
  }
  update(modalRemark) {
    this.additionService.updateRemark(modalRemark).subscribe(res => {
      this.alertify.success('Updated successfully!');
      this.getAllRemark();
    });
  }
  add(modalRemark) {
    this.additionService.createRemark(modalRemark).subscribe(() => {
      this.alertify.success('Add Remark successfully');
      this.getAllRemark();
      this.modalRemark.content = '';
    });
  }
  save() {
    this.additionService.createRemark(this.modalRemark).subscribe(() => {
      this.alertify.success('Add Remark successfully');
      this.getAllRemark();
      this.modalRemark.content = '';
    });
  }

  NO(index) {
    return (this.grid.pageSettings.currentPage - 1) * this.grid.pageSettings.pageSize + Number(index) + 1;
  }

}
