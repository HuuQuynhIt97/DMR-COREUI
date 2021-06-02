import { BaseComponent } from 'src/app/_core/_component/base.component';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ModalName } from '../../../../_core/_model/modal-name';
import { ModalNameService } from '../../../../_core/_service/modal-name.service';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { PageSettingsModel, GridComponent } from '@syncfusion/ej2-angular-grids';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EditService, ToolbarService, PageService } from '@syncfusion/ej2-angular-grids';
import { ActivatedRoute } from '@angular/router';
import { IngredientService } from 'src/app/_core/_service/ingredient.service';
import { GlueService } from 'src/app/_core/_service/glue.service';
import { ICommentModelName } from 'src/app/_core/_model/comment';
import { CommentService } from 'src/app/_core/_service/comment.service';
import { BuildingUserService } from 'src/app/_core/_service/building.user.service';
import { CalendarsService } from 'src/app/_core/_service/calendars.service';
import { AuthService } from 'src/app/_core/_service/auth.service';
import { BPFCEstablishService } from 'src/app/_core/_service/bpfc-establish.service';
import { count } from 'console';
import { UserService } from 'src/app/_core/_service/user.service';
import { IRole } from 'src/app/_core/_model/role';
import { ActionConstant } from 'src/app/_core/_constants';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-bpfc-status',
  templateUrl: './bpfc-status.component.html',
  styleUrls: ['./bpfc-status.component.css']
})
export class BpfcStatusComponent extends BaseComponent implements OnInit, AfterViewInit {
  public pageSettings: PageSettingsModel;
  users: any[] = [];
  BPFCEstablishID: number;
  public editparams: object;
  public grid: GridComponent;
  modalReference: NgbModalRef;
  modalReferenceDetail: NgbModalRef;
  public data: object[] = [];
  searchSettings: any = { hierarchyMode: 'Parent' };
  public name: string;
  pageSize: number;
  page: number;
  ingredients: any = [];
  glues: any = [];
  glueid: any;
  content: any;
  @ViewChild('gridModel')
  public gridModel: GridComponent;
  modalname: ModalName = {
    id: 0,
    name: '',
    modelNo: '',
    createdBy: JSON.parse(localStorage.getItem('user')).user.id
  };
  comment: ICommentModelName;
  comments: [];
  setFocus: any;
  level: any;
  newglueID: any;
  toolbar = ['Default',
    { text: 'Rejected', tooltipText: 'Rejected', prefixIcon: 'fa fa-times', id: 'Rejected' },
    { text: 'Approved', tooltipText: 'Approved', prefixIcon: 'fa fa-check', id: 'Approved' },
    'All', 'Search'
  ];
  tab: string;
  constructor(
    private modalNameService: ModalNameService,
    private bPFCEstablishService: BPFCEstablishService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private ingredientService: IngredientService,
    private glueService: GlueService,
    private commentService: CommentService,
    private calendarsService: CalendarsService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
  ) { super(); }

  ngOnInit() {
    this.tab = 'Default';
    this.Permission(this.route);
    this.pageSettings = { pageSizes: true, currentPage: 1, pageSize: 10, pageCount: 20 };
    this.editparams = { params: { popupHeight: '300px' } };
  }
  Permission(route: ActivatedRoute) {
    const functionCode = route.snapshot.data.functionCode;
    this.functions = JSON.parse(localStorage.getItem('functions')).filter(x => x.functionCode === functionCode) || [];
    for (const item of this.functions) {
      const toolbarOptions = [];
      for (const action of item.childrens) {
        const optionItem = this.makeAction(action.code);
        toolbarOptions.push(...optionItem.filter(Boolean));
      }
      toolbarOptions.push(...this.toolbar);
      const uniqueOptionItem = toolbarOptions.filter((elem, index, self) => {
        return index === self.indexOf(elem);
      });
      this.toolbarOptions = uniqueOptionItem;
    }
  }
  makeAction(input: string): string[] {
    switch (input) {
      case ActionConstant.EXCEL_EXPORT:
        return ['ExcelExport'];
      default:
        return [undefined];
    }
  }
  ngAfterViewInit() {
    const ROLE: IRole = JSON.parse(localStorage.getItem('level'));
    this.level = ROLE.id;
    this.getBuilding();
  }

  getBuilding() {
    const userID = JSON.parse(localStorage.getItem('user')).user.id;
    // this.authService.getBuildingByUserID(userID).subscribe((res: any) => {
    //   res = res || {};
    //   if (res !== {}) {
    //     this.level = res.level;
    //   }
    // });
  }
  createdSearch(args) {
    this.getAllUsers();

  }
  loadData() {
    switch (this.tab) {
      case 'Approved':
        this.filterByApprovedStatus();
        break;
      case 'Rejected':
        this.filterRejected();
        break;
      case 'All':
        this.getAllBPFCStatus();
        break;
      case 'Default':
        this.defaultFilter();
        break;
    }
  }
  dataBound() {
    this.gridModel.autoFitColumns();
  }

  no(item: any): number {
    return (this.pageSettings.currentPage - 1) * this.pageSettings.pageSize + Number(item.index) + 1;
  }

  actionBegin(args) {
    if (args.requestType === 'save') {
      this.modalname.id = args.data.id || 0;
      this.modalname.name = args.data.name;
      this.modalname.modelNo = args.data.modelNo;
      if (args.data.id > 0) {
        this.update(this.modalname);
      } else {
        this.add(this.modalname);
      }
    }
    if (args.requestType === 'delete') {
      this.delete(args.data[0].id);
    }
  }

  actionComplete(e: any): void {
    if (e.requestType === 'add') {
      (e.form.elements.namedItem('name') as HTMLInputElement).focus();
      (e.form.elements.namedItem('id') as HTMLInputElement).disabled = true;
      (e.form.elements.namedItem('tool') as HTMLInputElement).disabled = true;
    }
  }

  onDoubleClick(args: any): void {
    this.setFocus = args.column;  // Get the column from Double click event
  }

  openaddModalName(addModalName) {
    this.modalReference = this.modalService.open(addModalName);
  }

  getAllBPFCStatus() {
    this.spinner.show();
    this.bPFCEstablishService.getAllBPFCStatus().subscribe((res: any) => {
      this.data = res.map(item => {
        return  {
          id: item.id,
          modelNameID: item.modelNameID,
          modelNoID: item.modelNoID,
          articleNoID: item.articleNoID,
          artProcessID: item.artProcessID,
          modelName: item.modelName,
          modelNo: item.modelNo,
          articleNo: item.articleNo,
          artProcess: item.artProcess,
          approvalStatus: item.approvalStatus,
          finishedStatus: item.finishedStatus,
          approvalBy:  this.createdBy(item.approvalBy),
          createdBy:  this.createdBy(item.createdBy),
          season: item.season,
          createdDate: item.createdDate,
          modifiedDate: item.modifiedDate,
          updateTime: item.updateTime,
          bpfcName: `${item.modelName } - ${item.modelNo } - ${item.articleNo } - ${item.artProcess }`,
        };
      });
      this.editTextOfBtn();
      this.spinner.hide();
    }, () => this.spinner.hide());
  }
  filterRejected() {
    this.spinner.show();
    this.bPFCEstablishService.rejectedFilter().subscribe((res: any) => {
      this.data = res.map(item => {
        return {
          id: item.id,
          modelNameID: item.modelNameID,
          modelNoID: item.modelNoID,
          articleNoID: item.articleNoID,
          artProcessID: item.artProcessID,
          modelName: item.modelName,
          modelNo: item.modelNo,
          articleNo: item.articleNo,
          artProcess: item.artProcess,
          approvalStatus: item.approvalStatus,
          finishedStatus: item.finishedStatus,
          approvalBy: this.createdBy(item.approvalBy),
          createdBy: this.createdBy(item.createdBy),
          season: item.season,
          createdDate: item.createdDate,
          modifiedDate: item.modifiedDate,
          updateTime: item.updateTime,
          bpfcName: `${item.modelName} - ${item.modelNo} - ${item.articleNo} - ${item.artProcess}`,
        };
      });
      this.editTextOfBtn();
      this.spinner.hide();
    }, () => this.spinner.hide());
  }
  filterByApprovedStatus() {
    this.spinner.show();
    this.bPFCEstablishService.filterByApprovedStatus().subscribe((res: any) => {
      this.data = res.map(item => {
        return  {
          id: item.id,
          modelNameID: item.modelNameID,
          modelNoID: item.modelNoID,
          articleNoID: item.articleNoID,
          artProcessID: item.artProcessID,
          modelName: item.modelName,
          modelNo: item.modelNo,
          articleNo: item.articleNo,
          artProcess: item.artProcess,
          approvalStatus: item.approvalStatus,
          finishedStatus: item.finishedStatus,
          approvalBy:  this.createdBy(item.approvalBy),
          createdBy:  this.createdBy(item.createdBy),
          season: item.season,
          createdDate: item.createdDate,
          modifiedDate: item.modifiedDate,
          updateTime: item.updateTime,
          bpfcName: `${item.modelName } - ${item.modelNo } - ${item.articleNo } - ${item.artProcess }`,
        };
      });
      this.editTextOfBtn();
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

  filterByFinishedStatus() {
    this.spinner.show();
    this.bPFCEstablishService.filterByFinishedStatus().subscribe((res: any) => {
      this.data = res.map(item => {
        return  {
          id: item.id,
          modelNameID: item.modelNameID,
          modelNoID: item.modelNoID,
          articleNoID: item.articleNoID,
          artProcessID: item.artProcessID,
          modelName: item.modelName,
          modelNo: item.modelNo,
          articleNo: item.articleNo,
          artProcess: item.artProcess,
          approvalStatus: item.approvalStatus,
          finishedStatus: item.finishedStatus,
          approvalBy:  this.createdBy(item.approvalBy),
          createdBy:  this.createdBy(item.createdBy),
          season: item.season,
          createdDate: item.createdDate,
          modifiedDate: item.modifiedDate,
          updateTime: item.updateTime,
          bpfcName: `${item.modelName } - ${item.modelNo } - ${item.articleNo } - ${item.artProcess }`,
        };
      });
      this.editTextOfBtn();
      this.spinner.hide();
    }, () => this.spinner.hide());
  }
  defaultFilter() {
    this.spinner.show();
    this.bPFCEstablishService.defaultFilter().subscribe((res: any) => {
      this.data = res.map(item => {
        return {
          id: item.id,
          modelNameID: item.modelNameID,
          modelNoID: item.modelNoID,
          articleNoID: item.articleNoID,
          artProcessID: item.artProcessID,
          modelName: item.modelName,
          modelNo: item.modelNo,
          articleNo: item.articleNo,
          artProcess: item.artProcess,
          approvalStatus: item.approvalStatus,
          finishedStatus: item.finishedStatus,
          approvalBy: this.createdBy(item.approvalBy),
          createdBy: this.createdBy(item.createdBy),
          season: item.season,
          createdDate: item.createdDate,
          modifiedDate: item.modifiedDate,
          updateTime: item.updateTime,
          bpfcName: `${item.modelName} - ${item.modelNo} - ${item.articleNo} - ${item.artProcess}`,
        };
      });
      this.editTextOfBtn();
      this.spinner.hide();
    }, () => this.spinner.hide());
  }
  filterByNotApprovedStatus() {
    this.spinner.show();
    this.bPFCEstablishService.filterByNotApprovedStatus().subscribe((res: any) => {
      this.data = res.map(item => {
        return  {
          id: item.id,
          modelNameID: item.modelNameID,
          modelNoID: item.modelNoID,
          articleNoID: item.articleNoID,
          artProcessID: item.artProcessID,
          modelName: item.modelName,
          modelNo: item.modelNo,
          articleNo: item.articleNo,
          artProcess: item.artProcess,
          approvalStatus: item.approvalStatus,
          finishedStatus: item.finishedStatus,
          approvalBy:  this.createdBy(item.approvalBy),
          createdBy:  this.createdBy(item.createdBy),
          season: item.season,
          createdDate: item.createdDate,
          modifiedDate: item.modifiedDate,
          updateTime: item.updateTime,
          bpfcName: `${item.modelName } - ${item.modelNo } - ${item.articleNo } - ${item.artProcess }`,
        };
      });
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

  update(modelname) {
    this.modalNameService.update(modelname).subscribe(() => {
      this.alertify.success('Update Modal Name Successfully');
    });
  }

  delete(id) {
    this.alertify.confirm('Delete Modal Name', 'Are you sure you want to delete this ModalName ID "' + id + '" ?', () => {
      this.modalNameService.delete(id).subscribe(() => {
        this.getAllBPFCStatus();
        this.alertify.success('Modal Name has been deleted');
      });
    });
  }

  add(modalname) {
    this.modalNameService.create(modalname).subscribe(() => {
      this.alertify.success('Add Modal Name Successfully');
      this.getAllBPFCStatus();
    });
  }

  approval(BPFCEstablishID) {
    const userid = JSON.parse(localStorage.getItem('user')).user.id;
    this.bPFCEstablishService.approval(BPFCEstablishID, userid).subscribe(() => {
      this.alertify.success('The model name - model no has been approved!');
      this.getAllBPFCStatus();
    });
  }

  done(BPFCEstablishID) {
    const userid = JSON.parse(localStorage.getItem('user')).user.id;
    this.bPFCEstablishService.done(BPFCEstablishID, userid).subscribe(() => {
      this.alertify.success('The model name - model no has been finished!');
      this.getAllBPFCStatus();
    });
  }

  release() {
    const userid = JSON.parse(localStorage.getItem('user')).user.id;
    this.bPFCEstablishService.release(this.BPFCEstablishID, userid).subscribe(() => {
      this.alertify.success('The model name - model no has been released!');
      this.filterByApprovedStatus();
      this.modalReferenceDetail.close();
    });
  }

  reject() {
    const userid = JSON.parse(localStorage.getItem('user')).user.id;
    this.bPFCEstablishService.reject(this.BPFCEstablishID, userid).subscribe((res: any) => {
      if (res.status === true) {
        this.alertify.success(res.message);
        this.filterByNotApprovedStatus();
        this.modalReferenceDetail.close();
        const email = this.users.filter(item => item.ID === res.userId)[0].Email || '';

        this.bPFCEstablishService.sendMailForPIC(email).subscribe(() => { });
      } else {
        this.alertify.error(res.message);
      }
    });
  }

  openModalDetail(detail, BPFCEstablishID) {
    this.modalReferenceDetail = this.modalService.open(detail, { size: 'xxl' });
    setTimeout(() => {
      this.getAllGluesByBPFCID(BPFCEstablishID);
    }, 300);
    this.BPFCEstablishID = BPFCEstablishID;
    this.getComments();
  }

  sortBySup(glueid) {
    this.ingredientService.sortBySup(glueid, 0).subscribe((res: any) => {
      this.ingredients = res.list1;
    });
  }

  getAllGluesByBPFCID(BPFCEstablishID) {
    this.glueService.getAllGluesByBPFCID(BPFCEstablishID).subscribe((res: any) => {
      this.glues = res.map(item => {
        return {
          chemical: item.chemical,
          code: item.code,
          consumption: item.consumption,
          createdBy: this.createdBy(item.createdBy),
          createdDate: item.createdDate,
          expiredTime: item.expiredTime,
          glueID: item.glueID,
          glueName: item.glueName,
          id: item.id,
          ingredients: item.ingredients,
          materialName: item.materialName,
          materialNameID: item.materialNameID,
          modelNameID: item.modelNameID,
          modelNo: item.modelNo,
          modelNoID: item.modelNoID,
          name: item.name,
          partNameID: item.partNameID,
          pathName: item.pathName,
          bpfcName: `${item.modelName } - ${item.modelNo } - ${item.articleNo } - ${item.artProcess }`,
        };
      });
      if (this.glues.length === 0) {
        this.glueid = 0;
      } else {
        this.glueid = this.glues[0].id;
        this.sortBySup(this.glueid);
      }
    });
  }

  rowSelected(args: any) {
    const newGlueID = args.data.id;
    this.sortBySup(newGlueID);
  }

  toolbarClick(args: any): void {
    switch (args.item.id) {
      case 'Approved':
        this.tab = 'Approved';
        this.filterByApprovedStatus();
        break;
      case 'Rejected':
        this.tab = 'Rejected';
        this.filterRejected();
        break;
      case 'grid_All':
        this.tab = 'All';
        this.getAllBPFCStatus();
        break;
      case 'Excel Export':
        this.gridModel.excelExport();
        break;
      case 'grid_Default':
        this.tab = 'Default';
        this.defaultFilter();
        break;
    }
  }

  getAllUsers() {
    this.userService.getAllUserInfo().subscribe((res: any) => {
      this.users = res;
      this.loadData();
    });
  }

  /// comment
  createComment() {
    this.comment = {
      id: 0,
      content: this.content,
      createdBy: JSON.parse(localStorage.getItem('user')).user.id,
      createdByName: '',
      BPFCEstablishID: this.BPFCEstablishID,
      createdDate: new Date()
    };
    this.commentService.create(this.comment).subscribe(() => {
      this.alertify.success('The comment has been created!');
      this.content = '';
      this.getComments();
    });
  }

  updateComment() {
    this.commentService.update(this.comment).subscribe(() => {
      this.alertify.success('The comment has been updated!');
      this.getComments();
    });
  }

  deleteComment() {
    this.commentService.delete(this.comment.id).subscribe(() => {
      this.alertify.success('The comment has been deleted!');
      this.getComments();
    });
  }

  getComments() {
    this.commentService.getAllCommentByBPFCEstablishID(this.BPFCEstablishID).subscribe((res: any) => {
      this.comments = res;
    });
  }

  datetime(d) {
    return this.calendarsService.JSONDateWithTime(d);
  }

  username(id) {
    return (this.users.filter((item: any) => item.id === id)[0] as any).username;
  }

  createdBy(id) {
    if (id === 0) {
      return '#N/A';
    }
    const result = (this.users.filter((item: any) => item.id === id)[0] as any);
    if (result !== undefined) {
      return result.username;
    } else {
      return '#N/A';
    }
  }
  editTextOfBtn() {
    const allBtn = document.getElementById('grid_All') as HTMLButtonElement;
    const defaultBtn = document.getElementById('grid_Default') as HTMLButtonElement;
    const rejectedBtn = document.getElementById('Rejected') as HTMLButtonElement;
    const approvedBtn = document.getElementById('Approved') as HTMLButtonElement;
    switch (this.tab) {
      case 'All':
        this.setAttrBtn(allBtn);
        // reset color
        this.resetAttrBtn(defaultBtn);
        this.resetAttrBtn(rejectedBtn);
        this.resetAttrBtn(approvedBtn);
      break;
      case 'Default':
        this.setAttrBtn(defaultBtn);
        // reset color
        this.resetAttrBtn(allBtn);
        this.resetAttrBtn(rejectedBtn);
        this.resetAttrBtn(approvedBtn);
        break;
      case 'Rejected':
        this.setAttrBtn(rejectedBtn);
        // reset color
        this.resetAttrBtn(defaultBtn);
        this.resetAttrBtn(allBtn);
        this.resetAttrBtn(approvedBtn);
        break;
      case 'Approved':
        this.setAttrBtn(approvedBtn);
        // reset color
        this.resetAttrBtn(rejectedBtn);
        this.resetAttrBtn(defaultBtn);
        this.resetAttrBtn(allBtn);
        break;
    }
  }
  setAttrBtn(btn: HTMLButtonElement, styleBtn = {
    background: '#6c757d',
    boxShadow: '0 0 0 3px rgba(130, 138, 145, 0.5)',
    border: '1px solid #6c757d',
    margin: '0',
    borderColor: '#6c757d',
    borderRadius: '4px',
    color: '#fff',
  }) {
    btn.style.background = styleBtn.background;
    btn.style.boxShadow = styleBtn.boxShadow;
    btn.style.border = styleBtn.border;
    btn.style.margin = styleBtn.margin;
    btn.style.borderColor = styleBtn.borderColor;
    btn.style.borderRadius = styleBtn.borderRadius;
    btn.style.color = styleBtn.color;
  }
  resetAttrBtn(btn: HTMLButtonElement, styleBtn = {
    background: '#f8f9fa',
    boxShadow: 'none',
    border: 'none',
    margin: '0',
    borderColor: '#f8f9fa',
    borderRadius: 'none',
    color: '#495057',
  }) {
    btn.style.background = styleBtn.background;
    btn.style.boxShadow = styleBtn.boxShadow;
    btn.style.border = styleBtn.border;
    btn.style.margin = styleBtn.margin;
    btn.style.borderColor = styleBtn.borderColor;
    btn.style.borderRadius = styleBtn.borderRadius;
    btn.style.color = styleBtn.color;
  }
}
