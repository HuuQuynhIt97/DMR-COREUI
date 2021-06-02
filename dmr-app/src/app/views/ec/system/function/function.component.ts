import { Subscription } from 'rxjs';
import { FunctionAddEditComponent } from './function-add-edit/function-add-edit.component';
import { EmitType } from '@syncfusion/ej2-base';
import { BaseComponent } from 'src/app/_core/_component/base.component';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { GridComponent, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { PermissionService } from 'src/app/_core/_service/permission.service';
import { TreeGridComponent } from '@syncfusion/ej2-angular-treegrid';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-function',
  templateUrl: './function.component.html',
  styleUrls: ['./function.component.css']
})
export class FunctionComponent extends BaseComponent implements OnInit, OnDestroy {
  function: any;
  data: any = [];
  data2: object;
  @ViewChild('grid') grid: GridComponent;
  @ViewChild('treeGrid') treeGrid: TreeGridComponent;
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 20 };
  fieldsModule: object = { text: 'name', value: 'name' };
  filterSettings = { type: 'Excel' };
  permissionTypeData: object;
  permissionTypeID: any;
  moduleID: any;
  moduleData: object;
  parentID: number;
  level: number;
  parentItem: any;
  contextMenuItems2: any;
  subscription: Subscription;
  public queryCellInfoEvent: EmitType<QueryCellInfoEventArgs> = (args: QueryCellInfoEventArgs) => {
    const entity = 'entity';
    const data = args.data[entity];
    switch (data.level) {
      case 1:
        if (args.column.field === 'entity.languageID') {
          args.colSpan = 2;
          args.cell.textContent = data.moduleName;
        }
        break;
      case 2:
        if (args.column.field === 'entity.languageID') {
          args.colSpan = 2;
          args.cell.textContent = data.languageID;
        }
        if (args.column.field === 'entity.index'
        ) {
          args.colSpan = 5;
          args.cell.textContent = data.name;
        }
        break;
    }
  }
  constructor(
    private permissionService: PermissionService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private modalService: NgbModal,

  ) { super(); }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.subscription = new Subscription();
    this.contextMenuItems2 = [
      {
        text: 'Edit',
        iconCss: ' e-icons e-edit',
        target: '.e-content',
        id: 'edit'
      },
      {
        text: 'Delete',
        iconCss: ' e-icons e-delete',
        target: '.e-content',
        id: 'DeleteOC'
      }
    ];
    this.PermissionForTreeGrid(this.route);
    this.function = {
    };
    this.onService();
  }
  created() {
    this.getFunctionsAsTreeView();
    this.getAllModule();
  }

  // api
  getFunctionsAsTreeView() {
    this.permissionService.getFunctionsAsTreeView().subscribe(res => {
      this.data = res;
    });
  }
  getAllModule() {
    this.permissionService.getAllModule().subscribe(res => {
      this.moduleData = res;
    });
  }
  delete(id) {
    this.alertify.confirm2('Delete function', 'Are you sure you want to delete this function "' + id + '" ?', () => {
      this.permissionService.deleteFunction(id).subscribe(() => {
        this.getFunctionsAsTreeView();
        this.parentID = null;
        this.level = null;
        this.parentItem = {};
        this.alertify.success('The function has been deleted');
      }, error => {
        this.alertify.error('Failed to delete the function');
      });
    }, () => {
      this.parentID = null;
      this.level = null;
      this.parentItem = {};
      this.getFunctionsAsTreeView();
    });
  }
  deleteFunctionTranslation(id) {
    this.alertify.confirm2('Delete function translation', 'Are you sure you want to delete this function translation"' + id + '" ?', () => {
      this.permissionService.deleteFunctionTranslation(id).subscribe(() => {
        this.getFunctionsAsTreeView();
        this.alertify.success('The function translation has been deleted');
      }, error => {
        this.alertify.error('Failed to delete the function translation');
      });
    }, () => {
      this.getFunctionsAsTreeView();
    });
  }
  onService() {
    this.subscription.add(this.permissionService.currentMessage
      .subscribe(arg => {
        if (arg === 200) {
          this.getFunctionsAsTreeView();
        }
      }));
  }
  // end api

  // grid event
  toolbarClick(args) {
    switch (args.item.id) {
      case 'treegrid_gridcontrol_add':
        args.cancel = true;
        this.function.id = 0;
        this.function.name = "";
        this.function.code = "";
        this.function.url = "";
        this.function.icon = "";
        this.function.level = 1;
        this.function.sequence = 0;
        this.function.moduleID = 0;
        this.function.moduleName = "";
        this.function.parentID = 0;
        this.openAddModal();
        break;
      case 'treegrid_gridcontrol_pdfexport':
        this.treeGrid.pdfExport({ hierarchyExportMode: 'All' });
        break;
      case 'treegrid_gridcontrol_excelexport':
        this.treeGrid.excelExport({ hierarchyExportMode: 'All' });
        break;
      default:
        break;
    }
  }
  contextMenuClick(args) {
    console.log(args);
    let data = args.rowInfo.rowData.entity;
    this.function = {} ;
    let childNodes = args.rowInfo.rowData.childNodes;
    switch (args.item.id) {
      case 'DeleteOC':
        if (data.level === 1) {
           this.delete(args.rowInfo.rowData.entity.id);
        } else if (data.level === 2) {
          this.deleteFunctionTranslation(args.rowInfo.rowData.entity.id);
        }
        break;
      case 'edit':
        if (data.level === 2) {
          data = args.rowInfo.rowData.parentItem.entity;
          childNodes = args.rowInfo.rowData.parentItem.taskData.childNodes;
        }
        this.function.id = data.id;
        this.function.name = data.name;
        this.function.code = data.code;
        this.function.url = data.url;
        this.function.icon = "";
        this.function.level = data.level;
        this.function.sequence = data.sequence;
        this.function.moduleID = data.moduleID;
        this.function.moduleName = data.moduleName;
        this.function.parentID = data.id; // Gán ID hiện tại là cha của record đc tạo
        this.function.childNodes = childNodes; // Gán ID hiện tại là cha của record đc tạo
        this.openEditModal();
        break;
      default:
        break;
    }
  }
  openAddModal() {
    const modalRef = this.modalService.open(FunctionAddEditComponent, { size: 'lg' });
    modalRef.componentInstance.title = 'Add function';
    modalRef.componentInstance.function = this.function;
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }
  openEditModal() {
    const modalRef = this.modalService.open(FunctionAddEditComponent, { size: 'lg' });
    modalRef.componentInstance.title = 'Update function';
    modalRef.componentInstance.function = this.function;
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }
  rowSelected(args) {
    if (args.isInteracted) {
      const item = args.data.entity;
      this.parentID = +item?.id;
      this.level = Number(item.level) + 1;
      this.moduleID = item?.moduleID;
      this.parentItem = item;
    }
  }
  actionComplete(args) {
  }
  actionBegin(args) {
    if (args.requestType === 'beginEdit') {
      args.cancel = true;
    }
  }

  // end event
  NO(index) {
    return (this.treeGrid.pageSettings.currentPage - 1) * this.pageSettings.pageSize + Number(index) + 1;
  }
  onChangeModule(args) {
    this.moduleID = args.itemData.id;
  }
}
