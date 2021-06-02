import { EmitType } from '@syncfusion/ej2-base';
import { BaseComponent } from 'src/app/_core/_component/base.component';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GridComponent, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { PermissionService } from 'src/app/_core/_service/permission.service';
import { TreeGridComponent } from '@syncfusion/ej2-angular-treegrid';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Modulev2AddEditComponent } from './modulev2-add-edit/modulev2-add-edit.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modulev2',
  templateUrl: './modulev2.component.html',
  styleUrls: ['./modulev2.component.scss']
})
export class Modulev2Component extends BaseComponent implements OnInit, OnDestroy {
  module: any;
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
        if (args.column.field === 'entity.sequence') {
          args.colSpan = 2;
          args.cell.textContent = data.sequence;
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
    this.module = {
    };
    this.onService();
  }
  created() {
    this.getModulesAsTreeView();
    this.getAllModule();
  }

  // api
  getModulesAsTreeView() {
    this.permissionService.getModulesAsTreeView().subscribe(res => {
      this.data = res;
    });
  }
  getAllModule() {
    this.permissionService.getAllModule().subscribe(res => {
      this.moduleData = res;
    });
  }
  delete(id) {
    this.alertify.confirm2('Delete module', 'Are you sure you want to delete this module "' + id + '" ?', () => {
      this.permissionService.deleteModule(id).subscribe(() => {
        this.getModulesAsTreeView();
        this.parentID = null;
        this.level = null;
        this.parentItem = {};
        this.alertify.success('The module has been deleted');
      }, error => {
        this.alertify.error('Failed to delete the module');
      });
    }, () => {
      this.parentID = null;
      this.level = null;
      this.parentItem = {};
      this.getModulesAsTreeView();
    });
  }
  deleteModuleTranslation(id) {
    this.alertify.confirm2('Delete module translation', 'Are you sure you want to delete this module translation"' + id + '" ?', () => {
      this.permissionService.deleteModuleTranslation(id).subscribe(() => {
        this.getModulesAsTreeView();
        this.alertify.success('The module translation has been deleted');
      }, error => {
        this.alertify.error('Failed to delete the module translation');
      });
    }, () => {
      this.getModulesAsTreeView();
    });
  }
  onService() {
    this.subscription.add(this.permissionService.currentMessage
      .subscribe(arg => {
        if (arg === 200) {
          this.getModulesAsTreeView();
        }
      }));
  }
  // end api

  // grid event
  toolbarClick(args) {
    switch (args.item.id) {
      case 'treegrid_gridcontrol_add':
        args.cancel = true;
        this.module.id = 0;
        this.module.name = "";
        this.module.code = "";
        this.module.url = "";
        this.module.icon = "";
        this.module.level = 1;
        this.module.sequence = 0;
        this.module.moduleID = 0;
        this.module.moduleName = "";
        this.module.parentID = 0;
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
    this.module = {};
    let childNodes = args.rowInfo.rowData.childNodes;
    switch (args.item.id) {
      case 'DeleteOC':
        if (data.level === 1) {
          this.delete(args.rowInfo.rowData.entity.id);
        } else if (data.level === 2) {
          this.deleteModuleTranslation(args.rowInfo.rowData.entity.id);
        }
        break;
      case 'edit':
        if (data.level === 2) {
          data = args.rowInfo.rowData.parentItem.entity;
          childNodes = args.rowInfo.rowData.parentItem.taskData.childNodes;
        }
        this.module.id = data.id;
        this.module.name = data.name;
        this.module.code = data.code;
        this.module.url = data.url;
        this.module.icon = "";
        this.module.level = data.level;
        this.module.sequence = data.sequence;
        this.module.moduleID = data.moduleID;
        this.module.moduleName = data.moduleName;
        this.module.parentID = data.id; // Gán ID hiện tại là cha của record đc tạo
        this.module.childNodes = childNodes; // Gán ID hiện tại là cha của record đc tạo
        this.openEditModal();
        break;
      default:
        break;
    }
  }
  openAddModal() {
    const modalRef = this.modalService.open(Modulev2AddEditComponent, { size: 'lg' });
    modalRef.componentInstance.title = 'Add module';
    modalRef.componentInstance.module = this.module;
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }
  openEditModal() {
    const modalRef = this.modalService.open(Modulev2AddEditComponent, { size: 'lg' });
    modalRef.componentInstance.title = 'Update module';
    modalRef.componentInstance.module = this.module;
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

