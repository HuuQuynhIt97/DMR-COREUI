import { BaseComponent } from 'src/app/_core/_component/base.component';
import { PlanService } from './../../../../_core/_service/plan.service';
import { BPFC, IPlan, ITime, Plan } from './../../../../_core/_model/plan';
import { Component, OnInit, ViewChild, TemplateRef, OnDestroy, AfterViewInit, QueryList, ViewChildren } from '@angular/core';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import {
  PageSettingsModel, GridComponent,
  SelectionService, QueryCellInfoEventArgs,
  EditService, IEditCell, Column, ForeignKeyService
} from '@syncfusion/ej2-angular-grids';
import { NgbModal, NgbModalRef, NgbTimepicker } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { BPFCEstablishService } from 'src/app/_core/_service/bpfc-establish.service';
import { BuildingService } from 'src/app/_core/_service/building.service';
import { IRole } from 'src/app/_core/_model/role';
import { IBuilding } from 'src/app/_core/_model/building';
import { FilteringEventArgs, highlightSearch, DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { EmitType } from '@syncfusion/ej2-base';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/_core/_service/data.service';
import { TodolistService } from 'src/app/_core/_service/todolist.service';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { StationService } from 'src/app/_core/_service/station.service';
import * as introJs from 'intro.js/intro.js';
import { AuthService } from 'src/app/_core/_service/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Query } from '@syncfusion/ej2-data';
import { ActionConstant, RoleConstant } from 'src/app/_core/_constants';
import { ActivatedRoute } from '@angular/router';
declare var $;
@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css'],
  providers: [
    DatePipe,
    SelectionService,
    EditService,
    ForeignKeyService
  ]
})
export class PlanComponent extends BaseComponent implements OnInit, OnDestroy {
  introJS = introJs();
  @ViewChild('bpfcDropdownlist') public bpfcDropdownlist: DropDownListComponent;
  @ViewChild('cloneModal') public cloneModal: TemplateRef<any>;
  @ViewChild('stationModal') public stationModal: TemplateRef<any>;
  @ViewChild('planForm')
  orderForm: FormGroup;
  @ViewChild('timepicker') startTimepicker: NgbTimepicker;
  startTime: ITime = { hour: 7, minute: 0 };
  endTime: ITime = { hour: 16, minute: 30 };
  pageSettings: PageSettingsModel;
  sortSettings = { columns: [{ field: 'buildingName', direction: 'Ascending' }] };
  startDate: Date;
  endDate: Date;
  date: Date;
  bpfcID = 0;
  changebpfcID: number;
  level: number;
  hasWorker: boolean;
  role: IRole;
  building: IBuilding[];
  bpfcData: object;
  plansSelected: any;
  editparams: object;
  @ViewChild('grid')
  grid: GridComponent;
  dueDate: any;
  modalReference: NgbModalRef;
  data: any = [];
  plan: IPlan;
  searchSettings: any = { hierarchyMode: 'Parent' };
  BPFCsForChangeModal: any;
  modalPlan: Plan = {
    id: 0,
    buildingID: 0,
    BPFCEstablishID: 0,
    BPFCName: '',
    hourlyOutput: 0,
    workingHour: 0,
    dueDate: new Date(),
    startWorkingTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 7, 0, 0),
    finishWorkingTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 16, 30, 0),
    startTime: {
      hour: 7,
      minute: 0
    },
    endTime: {
      hour: 16,
      minute: 30
    }

  };
  @ViewChildren('tooltips') tooltips: QueryList<any>;
  modalStopLine: any
  public queryString: string;
  buildingNameForChangeModal = '';
  public textLine = 'Select a line name';
  public fieldsGlue: object = { text: 'name', value: 'name' };
  public fieldsLine: object = { text: 'name', value: 'id' };
  public fieldsBPFC: object = {
    text: 'name', value: 'id', tooltip: 'name', itemCreated: (e: any) => {
      highlightSearch(e.item, this.queryString, true, 'Contains');
    }
  };
  fieldsBuildings: object = { text: 'name', value: 'id' };
  startWorkingTimeParams = { params: { value: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 7, 30, 0) } };
  // tslint:disable-next-line:max-line-length
  finishWorkingTimeParams = { params: { value: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 16, 30, 0) } };
  public buildingName: any;
  public modelName: object[];
  lineID = 0;
  workHour: number;
  hourlyOutput: number;
  BPFCs: Array<BPFC> = new Array<BPFC>();
  bpfcEdit: number;
  glueDetails: any;
  setFocus: any;
  subscription: Subscription[] = [];
  selectOptions: object;
  hourlyOutputRules = { required: true };
  elem: HTMLInputElement;
  BpfcIdStopLineFixed: number = 1507
  modelNameStopLineFixed: string = "STOP"
  modelNoStopLineFixed: string = "STOP"
  articleNameStopLineFixed: string = "STOP"
  numericParams: IEditCell = {
    create: () => { // to create input element
      this.elem = document.createElement('input');
      return this.elem;
    },
    read: () => {
      return this.elem.value;
    },
    write: (args: { rowData: object, column: Column }) => { // to create input element
    },
    params: { value: 120, format: '####' }
  };
  buildings: IBuilding[];
  IsAdmin: boolean;
  buildingID: number;
  period: any = {};
  planID: number;
  isSTF: boolean;
  lines: any[] = [];
  lineStop: any[] = [];
  kindOfLine = 0;
  bpfcKindData: number[] = [];
  bpfcDataSource: Array<BPFC> = new Array<BPFC>();
  updateOnTimePercentage = '';
  planInfo: { text: string, total: any, updateOnTime: any, rate: any } = { text: "", total: 0, updateOnTime: 0, rate: 0 };
  @ViewChild('stopLineModal', { static: true })
  stopLineModal: TemplateRef<any>;
  dataPicked = [];
  @ViewChild('gridLine')
  public gridLine: GridComponent;

  @ViewChild('stopLines')
  public stopLines: GridComponent;

  @ViewChild('gridStopLine')
  public gridStopLine: GridComponent;
  StoplineDate: Date;
  constructor(
    private alertify: AlertifyService,
    public modalService: NgbModal,
    private planService: PlanService,
    private todolistService: TodolistService,
    private buildingService: BuildingService,
    private stationSevice: StationService,
    private authService: AuthService,
    private dataService: DataService,
    private spinner: NgxSpinnerService,
    private bPFCEstablishService: BPFCEstablishService,
    public datePipe: DatePipe,
    private route: ActivatedRoute
  ) {
    super();
    this.gridConfig();
  }

  ngOnInit() {
    this.Permission(this.route);
    this.buildingID = 0;
    this.date = new Date();
    this.endDate = new Date();
    this.StoplineDate = new Date();
    this.startDate = new Date();
    this.hasWorker = false;
    const BUIDLING: IBuilding[] = JSON.parse(localStorage.getItem('building'));
    const ROLE: IRole = JSON.parse(localStorage.getItem('level'));
    this.role = ROLE;
    this.building = BUIDLING;
    this.watch();
    this.checkRole();
    this.clearForm();
  }

  generateTodolist() {
    const selectedRecords = this.grid.dataSource as any[];
    const data = selectedRecords.filter(x => x.isGenerate === false && x.isOffline === false);
    if (data.length === 0) {
      this.alertify.warning(`Tất cả các kế hoạch làm việc đã được tạo nhiệm vụ!<br>
      All work plans have been created with tasks !`, true);
      return;
    }
    const plansSelected: number[] = data.map((item: any) => {
      return item.id;
    });
    this.todolistService.generateToDoList(plansSelected).subscribe((res: any) => {
      if (res.status) {
        this.alertify.success('Tạo nhiệm vụ thành công!<br>Success!', true);
        this.getAll();
        this.achievementRate();
      } else {
        this.alertify.error(res.message, true);
      }
    }, err => this.alertify.error(err, true));
  }

  showModal(importModal) {

    this.modalReference = this.modalService.open(importModal, { size: 'lg'});
    const selectedRecords = this.grid.dataSource as any[];
    const data = selectedRecords.filter(x => x.isGenerate || x.isOffline);
    const building_name = data.map((item: any) => {
      return item.buildingName;
    });
    for (const item of building_name) {
      for (var i = 0; i < this.lineStop.length; i++) {
        if (this.lineStop[i].name == item) {
          this.lineStop.splice(i, 1);
          break;
        }
      }
    }

    // event click out side modal and close model
    this.modalReference.result.then((result) => {
      this.dataPicked = []
      this.getAllLine(this.buildingID);
    }, (reason) => {
      this.dataPicked = []
      this.getAllLine(this.buildingID);
    });
    // end event
  }

  saveStopLine(){
    const obj = {
      buildingID: this.buildingID,
      dueDate: this.endDate,
      startWorkingTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 7, 0, 0),
      finishWorkingTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 16, 30, 0),
      listAdd: this.dataPicked
    }
    this.planService.createForStopLine(obj).subscribe(res => {
      if (res) {
        this.alertify.success('Tạo thành công!<br>Created succeeded!');
        this.getAll();
        this.achievementRate();
        this.modalReference.close();
        this.dataPicked = []
        this.getAllLine(this.buildingID);
      } else {
        this.alertify.warning('Dữ liệu đã tồn tại! <br>This plan has already existed!!!');
        this.getAll();
      }
    }, error => {
      this.alertify.error(error, true);
      this.grid.refresh();
      this.getAll();
      this.getAllLine(this.buildingID);
      this.dataPicked = []
      this.clearForm();
    });
    // this.planService.create(this.dataPicked)
  }

  rowSelected(args) {
    if (args.isHeaderCheckboxClicked) {
      for (const item of args.data) {
        this.modalStopLine = {
          id: 0,
          buildingID: item.id,
          BPFCEstablishID: 0,
          BPFCName: '',
          IsOffline: true,
          hourlyOutput: 0,
          workingHour: 0,
          dueDate: this.StoplineDate,
          startWorkingTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 7, 0, 0),
          finishWorkingTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 16, 30, 0),
          startTime: {
            hour: 7,
            minute: 0
          },
          endTime: {
            hour: 16,
            minute: 30
          },
        };
        this.dataPicked.push(this.modalStopLine);
      }
    }else {
      this.modalStopLine = {
        id: 0,
        buildingID: args.data.id,
        BPFCEstablishID: 0,
        BPFCName: '',
        IsOffline: true,
        hourlyOutput: 0,
        workingHour: 0,
        dueDate: this.StoplineDate,
        startWorkingTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 7, 0, 0),
        finishWorkingTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 16, 30, 0),
        startTime: {
          hour: 7,
          minute: 0
        },
        endTime: {
          hour: 16,
          minute: 30
        },
      };
      this.dataPicked.push(this.modalStopLine);
    }
    console.log('rowSelected',this.dataPicked);
  }

  rowDeselected(args) {
    console.log('rowDeselected',args);
    // if (args.isHeaderCheckboxClicked) {
    //   for (const item of args.data) {
    //     for (var i = 0; i < this.dataPicked.length; i++) {
    //       if (this.dataPicked[i].buildingID == item.id) {
    //         this.dataPicked.splice(i, 1);
    //         break;
    //       }
    //     }
    //   }
    // }else {
    //   for (var i = 0; i < this.dataPicked.length; i++) {
    //     if (this.dataPicked[i].buildingID == args.data.id) {
    //       this.dataPicked.splice(i, 1);
    //       break;
    //     }
    //   }
    // }
  }

  onTimeChange(agrs) {
  }

  public onFiltering: EmitType<FilteringEventArgs> = (
    e: FilteringEventArgs
  ) => {
    this.queryString = e.text;
    let query: Query = new Query();
    // frame the query based on search string with filter type.
    query =
      e.text !== '' ? query.where('name', 'contains', e.text, true) : query;
    // pass the filter data source, filter query to updateData method.
    e.updateData(this.BPFCs as any, query);
  }

  watch() {
    const watchAction = this.stationSevice.getValue().subscribe(status => {
      if (status === true) {
        this.getAll();
      }
    });
    this.subscription.push(watchAction);
  }

  checkRole(): void {
    const buildingId = +localStorage.getItem('buildingID');
    if (buildingId === 0) {
      this.getBuilding(() => {
        this.alertify.message('Please select a building! <br> Vui lòng chọn 1 tòa nhà!', true);
      });
    } else {
      this.getBuilding(() => {
        this.buildingID = buildingId;
      });
    }
  }

  ngOnDestroy() {
    localStorage.removeItem('isSTF');
    this.subscription.forEach(subscription => subscription.unsubscribe());
  }
  onFilteringBuilding: EmitType<FilteringEventArgs> = (
    e: FilteringEventArgs
  ) => {
    let query: Query = new Query();
    // frame the query based on search string with filter type.
    query =
      e.text !== '' ? query.where('name', 'contains', e.text, true) : query;
    // pass the filter data source, filter query to updateData method.
    e.updateData(this.buildings as any, query);
  }

  filterLineData(){
    const selectedRecords = this.grid.dataSource as any[];
    const data = selectedRecords;
    const building_name = data.map((item: any) => {
      return item.buildingName;
    });
    for (const item of building_name) {
      for (var i = 0; i < this.lines.length; i++) {
        if (this.lines[i].name == item) {
          this.lines.splice(i, 1);
          break;
        }
      }
    }
  }

  getAllLine(buildingID) {
    this.planService.getLines(buildingID).subscribe((res: any) => {
      this.lines = res;
      this.lineStop = res;
    });
  }

  onChangeBuilding(args) {
    this.buildingID = args.itemData.id;
    this.buildingName = args.itemData.name;
    this.isSTF = args.itemData.isSTF as boolean;
    localStorage.setItem('buildingID', args.itemData.id);
    localStorage.setItem('isSTF', args.itemData.isSTF);
    this.getAll();
    this.achievementRate();
    this.getStartTimeFromPeriod();
    this.getAllBPFC();
    this.buildingID = this.buildingID === undefined ? 0 : this.buildingID;
    this.getAllLine(this.buildingID);
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
      toolbarOptions.push(...['Search', 'ColumnChooser']);
      const uniqueOptionItem = toolbarOptions.filter((elem, index, self) => {
        return index === self.indexOf(elem);
      });
      this.toolbarOptions = uniqueOptionItem;
    }
  }

  makeAction(input: string): any[] {
    const lang = localStorage.getItem('lang');
    switch (input) {
      case ActionConstant.EXCEL_EXPORT:
        if (lang === 'vi') {
          return [
            { text: 'Xuất Excel', tooltipText: 'Xuất Excel', prefixIcon: 'e-btn-icon fa fa-file-excel-o e-icons e-icon-left', id: 'exportExcel' }
          ];
        }
        return [
          { text: 'Export Excel', tooltipText: 'Export Excel', prefixIcon: 'e-btn-icon fa fa-file-excel-o e-icons e-icon-left', id: 'exportExcel' }
        ];
      case ActionConstant.CREATE:
        this.editSettings.allowAdding = true;
        return ['Add'];

      case ActionConstant.EDIT:
        this.editSettings.allowEditing = true;
        if (lang === 'vi') {
          return [
            {
              text: 'Cập nhật', tooltipText: 'Cập nhật',
              prefixIcon: 'fa fa-tasks', id: 'Update'
            }
          ];
        }
        return [
          { text: 'Update', tooltipText: 'Update', prefixIcon: 'fa fa-tasks', id: 'Update' }
        ];

      case ActionConstant.STOP_LINE:
        if (lang === 'vi') {
          return [
            { text: 'Ngưng chuyền', tooltipText: 'Ngưng chuyền', prefixIcon: 'fa fa-stop', id: 'Stopline' }
          ];
        }
        return [
          { text: 'Stop Line', tooltipText: 'Stop Line', prefixIcon: 'fa fa-stop', id: 'Stopline' }
        ];

      default:
        return [undefined];
    }
  }

  gridConfig(): void {
    this.selectOptions = { checkboxOnly: true };
    this.pageSettings = { pageCount: 20, pageSizes: true, pageSize: 12 };
    this.editparams = { params: { popupHeight: '300px' } };
  }

  count(index) {
    return Number(index) + 1;
  }

  onDoubleClick(args: any): void {
    this.setFocus = args.column; // Get the column from Double click event
  }

  getBuildingWorker(callback) {
    const userID = +JSON.parse(localStorage.getItem('user')).user.id;
    this.authService.getBuildingUserByUserID(userID).subscribe((res) => {
      this.buildings = res.data;
      callback();
    });
  }

  getBuilding(callback): void {
    const userID = +JSON.parse(localStorage.getItem('user')).user.id;
    this.authService.getBuildingUserByUserID(userID).subscribe((res) => {
      this.buildings = res.data;
      callback();
    });
    // this.buildingService.getBuildings().subscribe(async (buildingData) => {
    //   this.buildings = buildingData.filter(item => item.level === SystemConstant.BUILDING_LEVEL);
    //   callback();
    // });
  }

  achievementRate() {
    this.planService.achievementRate(this.buildingID).subscribe((res: any) => {
      this.planInfo = res.data;
    });
  }

  onChangeLine(args, data) {
    this.lineID = args.itemData?.id || 0;
    this.kindOfLine = args.itemData?.kindID || 0;
    if (this.isSTF) {
      this.BPFCs = this.bpfcDataSource.filter(x => x.kinds.includes(this.kindOfLine) && x.artProcess === 'STF');
      this.bpfcDropdownlist.refresh();
    } else {
      this.BPFCs = this.bpfcDataSource.filter(x => x.artProcess !== 'STF');
      this.bpfcDropdownlist.refresh();
    }
    if (data.isGenerate) {
      if (data.buildingID !== this.lineID) {
        this.lineID = data.buildingID;
        this.grid.refresh();
        this.alertify.warning(`Không được cập nhật chuyền cho kế hoạch làm việc này! <br>
        Lý Do: Kế hoạch làm việc này đã tạo danh sách việc làm rồi! `, true);
        return;
      }
    }
  }

  onChangeDueDateEdit(args, data) {
    this.dueDate = (args.value as Date)?.toDateString();
    if (data.isGenerate) {
      if (data.buildingID !== this.lineID) {
        this.lineID = data.buildingID;
        this.grid.refresh();
        this.alertify.warning(`Không được cập nhật ngày thực thi cho kế hoạch làm việc này! <br>
        Lý Do: Kế hoạch làm việc này đã tạo danh sách việc làm rồi! `, true);
        return;
      }
    }
  }

  onChangeDueDateClone(args) {
    this.date = (args.value as Date);
  }

  onChangeBPFC(args, data) {
    this.bpfcID = args.itemData?.id || 0;
    this.bpfcKindData = args.itemData?.kinds || [];
    if (this.isSTF) {
      this.validateKind();
    }
    if (data.isGenerate) {
      if (data.bpfcEstablishID !== this.bpfcID) {
        this.alertify.warning(`Không được cập nhật BPFC cho kế hoạch làm việc này! <br>
        Lý Do: Kế hoạch làm việc này đã tạo danh sách việc làm rồi!
        `, true);
        this.bpfcID = data.bpfcEstablishID;
        this.grid.refresh();
        return;
      }
    }
  }

  actionComplete(args) {
    if (args.requestType === 'beginEdit') {
      if (this.setFocus.field !== 'buildingName' && this.setFocus.field !== 'bpfcName') {
        // (args.form.elements.namedItem(this.setFocus?.field) as HTMLInputElement).focus();
      }
    }
  }

  convertTimeToDatetime(time: { hour: number, minute: number }) {
    const date = new Date().toDateString() + ` ${time.hour}:${time.minute}`;
    return date;
  }

  convertDatetimeToTime(date: Date) {
    const value = date;
    const time = { hour: value.getHours(), minute: value.getMinutes() };
    return time;
  }

  dataBound() {
    this.grid.autoFitColumns();
  }

  rowDataBound(args) {
  }

  onChangeStartTime(value: Date) {
    // this.startTime = { hour: value.getHours(), minute: value.getMinutes() };
    // this.modalPlan.startTime = { hour: value.getHours(), minute: value.getMinutes() };

  }
  onChangeEndTime(value: Date) {
    // this.endTime = { hour: value.getHours(), minute: value.getMinutes() };
    // this.modalPlan.endTime = { hour: value.getHours(), minute: value.getMinutes() };
  }

  actionBegin(args) {
    // this.filterLineData()
    if (args.requestType === 'add' && args.type === "actionBegin") {
      args.data.hourlyOutput = 120;
    }
    if (args.requestType === 'beginEdit') {
      const data = args.rowData;
      if (args.rowData.isOffline === true) {
        args.cancel = true;
      }

      this.clearForm();
      this.modalPlan.finishWorkingTime = data.finishWorkingTime;
      this.modalPlan.startWorkingTime = data.startWorkingTime;
      this.dueDate = data.dueDate;
      this.modalPlan.startTime = {
        hour: this.modalPlan.startWorkingTime.getHours(),
        minute: this.modalPlan.startWorkingTime.getMinutes()
      };
      this.modalPlan.endTime = {
        hour: this.modalPlan.finishWorkingTime.getHours(),
        minute: this.modalPlan.finishWorkingTime.getMinutes()
      };
    }
    if (args.requestType === 'cancel') {
      this.clearForm();
      this.grid.refresh();
    }

    if (args.requestType === 'save') {
      if (args.action === 'edit') {
        const previousData = args.previousData;
        const data = args.data;
        if (args.data.isGenerate) {
          if (previousData.hourlyOutput !== data.hourlyOutput) {
            this.alertify.warning(`Không được cập nhật sản lượng hàng giờ cho kế hoạch làm việc này! <br>
            Lý Do: Kế hoạch làm việc này đã tạo danh sách việc làm rồi!`, true);
            this.grid.refresh();
            return;
          }
        }
        this.modalPlan.id = args.data.id || 0;
        this.modalPlan.buildingID = args.data.buildingID;
        this.modalPlan.dueDate = this.dueDate;
        this.modalPlan.workingHour = args.data.workingHour;
        this.modalPlan.BPFCEstablishID = args.data.bpfcEstablishID;
        this.modalPlan.BPFCName = args.data.bpfcName;
        this.modalPlan.hourlyOutput = args.data.hourlyOutput;
        this.modalPlan.startTime = {
          hour: this.modalPlan.startWorkingTime.getHours(),
          minute: this.modalPlan.startWorkingTime.getMinutes()
        };
        this.modalPlan.endTime = {
          hour: this.modalPlan.finishWorkingTime.getHours(),
          minute: this.modalPlan.finishWorkingTime.getMinutes()
        };

        this.planService.update(this.modalPlan).subscribe(res => {
          this.alertify.success('Cập nhật thành công! <br>Updated succeeded!');
          this.clearForm();
          this.getAll();
        }, error => {
          this.alertify.error(error, true);
          this.grid.refresh();
          this.getAll();
          this.clearForm();
        });
      }
      if (args.action === 'add') {
        const hourlyOutput = args.data.hourlyOutput || 120;
        this.modalPlan.buildingID = this.lineID;
        this.modalPlan.dueDate = this.dueDate;
        this.modalPlan.workingHour = args.data.workingHour || 0;
        this.modalPlan.BPFCEstablishID = this.bpfcID;
        this.modalPlan.BPFCName = args.data.bpfcName;
        this.modalPlan.hourlyOutput = hourlyOutput;
        this.modalPlan.startTime = {
          hour: this.modalPlan.startWorkingTime.getHours(),
          minute: this.modalPlan.startWorkingTime.getMinutes()
        };
        this.modalPlan.endTime = {
          hour: this.modalPlan.finishWorkingTime.getHours(),
          minute: this.modalPlan.finishWorkingTime.getMinutes()
        };
        this.planService.create(this.modalPlan).subscribe(res => {
          if (res) {
            this.alertify.success('Tạo thành công!<br>Created succeeded!');
            this.getAll();
            this.getAllLine(this.buildingID)
            this.achievementRate();
            this.clearForm();
          } else {
            this.alertify.warning('Dữ liệu đã tồn tại! <br>This plan has already existed!!!');
            this.getAll();
            this.clearForm();
          }
        }, error => {
          this.alertify.error(error, true);
          this.grid.refresh();
          this.getAll();
          this.clearForm();
        });
      }
    }
  }

  private clearForm() {
    this.modalPlan = {
      id: 0,
      buildingID: 0,
      BPFCEstablishID: 0,
      BPFCName: '',
      hourlyOutput: 0,
      workingHour: 0,
      dueDate: new Date(),
      startWorkingTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay(), 7, 0, 0),
      finishWorkingTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay(), 16, 30, 0),
      startTime: {
        hour: 7,
        minute: 0
      },
      endTime: {
        hour: 16,
        minute: 30
      }

    };
    this.startTime = {
      hour: 7,
      minute: 0
    };
    this.endTime = {
      hour: 16,
      minute: 30
    };
    this.bpfcID = 0;
    this.hourlyOutput = 0;
    this.workHour = 0;
    this.dueDate = new Date();
    this.queryString = '';
  }

  private validForm(): boolean {
    const array = [this.bpfcID];
    return array.every(item => item > 0);
  }

  onChangeWorkingHour(args) {
    this.workHour = args;
  }

  onChangeHourlyOutput(args) {

    this.hourlyOutput = args;
  }

  openaddModalPlan(addModalPlan) {
    this.modalReference = this.modalService.open(addModalPlan);
  }


  actionFailure(e: any): void {
  }

  getAllBPFC() {
    this.bPFCEstablishService.filterByApprovedStatus().subscribe((res: any) => {
      this.bpfcDataSource = res.map((item) => {
        return {
          id: item.id,
          artProcess: item.artProcess,
          glues: item.glues,
          kinds: item.kinds,
          name: `${item.modelName} - ${item.modelNo} - ${item.articleNo} - ${item.artProcess}`,
        } as BPFC;
      });
      this.isSTF = JSON.parse(localStorage.getItem('isSTF'));
      if (this.isSTF) {
        const bpfcList = res.filter(x => x.artProcess === 'STF').map((item) => {
          return {
            id: item.id,
            artProcess: item.artProcess,
            glues: item.glues,
            kinds: item.kinds,
            name: `${item.modelName} - ${item.modelNo} - ${item.articleNo} - ${item.artProcess}`,
          };
        });
        this.BPFCs = Object.assign([], bpfcList);
        this.BPFCsForChangeModal = Object.assign([], bpfcList);
      } else {
        const bpfcList = res.filter(x => x.artProcess !== 'STF').map((item) => {
          return {
            id: item.id,
            artProcess: item.artProcess,
            glues: item.glues,
            kinds: item.kinds,
            name: `${item.modelName} - ${item.modelNo} - ${item.articleNo} - ${item.artProcess}`,
          };
        });
        this.BPFCs = Object.assign([], bpfcList);
        this.BPFCsForChangeModal = Object.assign([], bpfcList);
      }
    });
  }

  getStartTimeFromPeriod() {
    this.planService.getStartTimeFromPeriod(this.buildingID).subscribe(res => {
      if (res.status === true) {
        this.period = res.data;

      } else {
        this.alertify.warning(res.message);
      }
    }, err => this.alertify.warning(err.message));
  }

  getAll() {
    this.planService.search(this.buildingID, this.startDate.toDateString(), this.endDate.toDateString()).subscribe((res: any) => {
      this.data = res.map(item => {
        return {
          id: item.id,
          bpfcName: `${item.modelName} - ${item.modelNoName} - ${item.articleName} - ${item.processName}`,
          dueDate: item.dueDate,
          modelName: item.modelName,
          modelNoName: item.modelNoName,
          articleName: item.articleName,
          createdDate: item.createdDate,
          hourlyOutput: item.hourlyOutput,
          buildingName: item.buildingName,
          buildingID: item.buildingID,
          startWorkingTime: new Date(item.startWorkingTime),
          finishWorkingTime: new Date(item.finishWorkingTime),
          startTime: item.startTime,
          endTime: item.endTime,
          isChangeBPFC: item.isChangeBPFC,
          bpfcEstablishID: item.bpfcEstablishID,
          glues: item.glues || [],
          lineKind: item.lineKind,
          isGenerate: item.isGenerate,
          isOvertime: item.isOvertime,
          isOffline: item.isOffline,
          updatedTime: item.updatedTime,
          updatedOffline: item.updatedOffline,
          updatedOvertime: item.updatedOvertime,
          isShowOvertimeOption: item.isShowOvertimeOption
        };
      });
    });
  }
  deleteRange(plans) {
    this.alertify.confirm('Delete Plan <br> Xóa kế hoạc làm việc', 'Are you sure you want to delete this Plans ?<br> Bạn có chắc chắn muốn xóa không?', () => {
      this.planService.deleteRange(plans).subscribe(() => {
        this.getAll();
        this.alertify.success('Xóa thành công! <br>Plans has been deleted');
      }, error => {
        this.alertify.error('Xóa thất bại! <br>Failed to delete the Model Name');
      });
    });
  }

  delete(id) {
    this.alertify.confirm('Delete Plan <br> Xóa kế hoạc làm việc', 'Are you sure you want to delete this Plans ?<br> Bạn có chắc chắn muốn xóa không?', () => {
      this.planService.deleteRange([id]).subscribe(() => {
        this.getAll();
        this.getAllLine(this.buildingID);
        this.alertify.success('Xóa thành công! <br>Plans has been deleted');
      }, error => {
        this.getAllLine(this.buildingID);
        this.alertify.error('Xóa thất bại! <br>Failed to delete the Model Name');
      });
    });
  }
  /// Begin API
  openModal(ref) {
    const selectedRecords = this.grid.getSelectedRecords();
    if (selectedRecords.length !== 0) {
      this.plansSelected = selectedRecords.map((item: any) => {
        return {
          id: item.id,
          bpfcEstablishID: item.bpfcEstablishID,
          hourlyOutput: item.hourlyOutput,
          dueDate: item.dueDate,
          buildingID: item.buildingID
        };
      });
      this.modalReference = this.modalService.open(ref);
    } else {
      this.alertify.warning('Hãy chọn 1 hoặc nhiều dòng để nhân bản!<br>Please select the plan!', true);
    }
  }
  openCloneModal(item) {
    this.modalReference = this.modalService.open(this.cloneModal);
    this.plansSelected = [{
      id: item.id,
      bpfcEstablishID: item.bpfcEstablishID,
      hourlyOutput: item.hourlyOutput,
      dueDate: item.dueDate,
      buildingID: item.buildingID
    }];
  }


  toolbarClick(args: any): void {
    switch (args.item.id) {
      case 'Clone':
        this.openModal(this.cloneModal);
        break;
      case 'Update':
        this.generateTodolist();
        break;
      case 'Stopline':
        this.showModal(this.stopLineModal)
        break;
      case 'exportExcel':
        this.spinner.show();
        const plans = this.data.map((item: any) => item.id);
        const start = this.datePipe.transform(this.startDate, "YYYY-MM-dd");
        const end = this.datePipe.transform(this.endDate, "YYYY-MM-dd");
        this.planService.exportExcelWorkPlanWholeBuilding(this.buildingID, start, end).subscribe((data: any) => {
          const blob = new Blob([data],
            { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

          const downloadURL = window.URL.createObjectURL(data);
          const link = document.createElement('a');
          link.href = downloadURL;
          const startDateFormat = this.datePipe.transform(this.startDate, "YYYYMMdd");
          const endDateFormat = this.datePipe.transform(this.endDate, "YYYYMMdd");
          link.download = `${startDateFormat}-${endDateFormat}_WorkPlan.xlsx`;
          link.click();
          this.spinner.hide();
        }, err => {
          this.spinner.hide();
          this.alertify.error('Server error! Can not download excel file!');
        });
        break;
      default:
        break;
    }
  }

  onClickClone() {
    this.plansSelected.map(item => {
      item.dueDate = this.date;
    });

    this.planService.clonePlan(this.plansSelected).subscribe((res: any) => {
      if (res) {
        this.alertify.success('Nhân bản thành công! <br>Successfully!');
        this.startDate = this.date;
        this.endDate = this.date;
        this.getAll();
        this.modalService.dismissAll();
      } else {
        this.alertify.warning('Dữ liệu này đã tồn tại!<br>The plans have already existed!');
        this.modalService.dismissAll();
      }
    });
  }

  search(startDate, endDate) {
    this.planService.search(this.buildingID, startDate.toDateString(), endDate.toDateString()).subscribe((res: any) => {
      this.data = res.map(item => {
        return {
          id: item.id,
          bpfcName: `${item.modelName} - ${item.modelNoName} - ${item.articleName} - ${item.processName}`,
          dueDate: item.dueDate,
          createdDate: item.createdDate,
          hourlyOutput: item.hourlyOutput,
          buildingName: item.buildingName,
          buildingID: item.buildingID,
          startWorkingTime: new Date(item.startWorkingTime),
          finishWorkingTime: new Date(item.finishWorkingTime),
          startTime: item.startTime,
          endTime: item.endTime,
          isChangeBPFC: item.isChangeBPFC,
          bpfcEstablishID: item.bpfcEstablishID,
          glues: item.glues || [],
          lineKind: item.lineKind,
          isGenerate: item.isGenerate,
          isOvertime: item.isOvertime,
          isOffline: item.isOffline,
          updatedTime: item.updatedTime,
          updatedOffline: item.updatedOffline,
          updatedOvertime: item.updatedOvertime,
          isShowOvertimeOption: item.isShowOvertimeOption
        };
      });
    });
  }

  changeStopLine(args, data) {
    const planID = data.id;
    if (args.checked) {
      this.offline(planID, () => {
        this.grid.refresh();
      });
    } else {
      this.online(planID, () => {
        this.grid.refresh();
      });
    }
  }

  changeOvertime(args, data) {
    const plans = [data.id];
    if (args.checked) {
      this.addOvertime(plans, () => {
        this.grid.refresh();
      });
    } else {
      this.removeOvertime(plans, () => {
        this.grid.refresh();
      });
    }
  }

  onClickDefault() {
    this.startDate = new Date();
    this.endDate = new Date();
    this.getAll();
  }

  startDateOnchange(args) {
    this.startDate = (args.value as Date);
    this.search(this.startDate, this.endDate);
  }

  endDateOnchange(args) {
    this.endDate = (args.value as Date);
    this.search(this.startDate, this.endDate);
  }

  tooltipContext(data) {

    if (data) {

      const array = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
      const glues = [];
      for (const item of data) {
        if (!array.includes(item)) {
          glues.push(item);
        }
      }
      if (glues.length === 0) {
        return 'N/A';
      }
      return glues.join('<br>');
    } else {
      return 'N/A';
    }
  }
  onBeforeRenderBPFC(args, data, i) {
    const t = this.tooltips.filter((item, index) => index === +i)[0];

    t.content = this.tooltipContext(data.glues);
    console.log(t.content);
    t.dataBind();

  }
  onBeforeRenderLine(args, data, i) {
    console.log(data);
    const t = this.tooltips.filter((item, index) => index === +i)[0];
    t.content = data.lineKind;
    t.dataBind();
  }
  tooltip(args: QueryCellInfoEventArgs) {
    if (args.column.field === 'bpfcName') {
      const data = args.data as any;
      const tooltip: Tooltip = new Tooltip({
        content: this.tooltipContext(data.glues)
      }, args.cell as HTMLTableCellElement);
    }
    if (args.column.field === 'buildingName') {
      const data = args.data as any;
      const tooltip: Tooltip = new Tooltip({
        content: data.lineKind
      }, args.cell as HTMLTableCellElement);
    }
  }

  onClickFilter() {
    this.search(this.startDate, this.endDate);
  }



  generateDispatchList() {
    const selectedRecords = this.grid.dataSource as any[];
    const data = selectedRecords.filter(x => x.isGenerate === false);
    if (data.length === 0) {
      this.alertify.warning(`Tất cả các kế hoạch làm việc đã được tạo nhiệm vụ!<br>
      All work plans have been created with tasks !`, true);
      return;
    }
    const plansSelected: number[] = data.map((item: any) => {
      return item.id;
    });
    this.todolistService.generateDispatchList(plansSelected).subscribe((res: any) => {
      if (res.status) {
        this.alertify.success('Tạo nhiệm vụ thành công!<br>Success!', true);
        this.getAll();
      } else {
        this.alertify.error(res.message, true);
      }
    }, err => this.alertify.error(err, true));
  }

  changeBPFC() {
    this.planService.changeBPFC(this.planID, this.changebpfcID).subscribe(() => {
      this.alertify.success('Tạo nhiệm vụ thành công!<br>Success!', true);
      this.getAll();
      this.modalReference.dismiss();
    }, err => this.alertify.error(err, true));
  }

  online(planID, cancelCallback) { // v102
    this.alertify.confirm2('Open Line! <br>Mở lại nhé!', 'Are you sure you want to open line of this Plans ?<br> Bạn có chắc chắn muốn mở lại chuyền không?', () => {
      this.planService.online(planID).subscribe(() => {
        this.alertify.success('Thành công!<br>Success!', true);
        this.getAll();
      }, err => this.alertify.error(err, true));
    }, () => {
      cancelCallback();
    });
  }

  offline(planID, cancelCallback) { // v102
    this.alertify.confirm2('Stop Line! <br>  Ngưng chuyền không!', 'Are you sure you want to stop line of this Plans ?<br> Bạn có chắc chắn muốn ngưng chuyền không?', () => {
      this.planService.offline(planID).subscribe(() => {
        this.alertify.success('Thành công!<br>Success!', true);
        this.getAll();
      }, err => this.alertify.error(err, true));
    }, () => {
      cancelCallback();
    });
  }
  // End API

  // modal
  openStationComponent(data) {
    // const modalRef = this.modalService.open(StationComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    // modalRef.componentInstance.plan = data as IPlan;
    // modalRef.result.then((result) => {
    // }, (reason) => {
    // });
  }

  openChangeBPFCModalComponent(name, data) {
    this.planID = data.id;
    this.buildingNameForChangeModal = data.buildingName;
    this.modalReference = this.modalService.open(name, { size: 'lg' });
    this.modalReference.result.then((result) => {
    }, (reason) => {
    });
  }
  // end modal

  public onFilteringChangeBPFCModal: EmitType<FilteringEventArgs> = (
    e: FilteringEventArgs
  ) => {
    let query: Query = new Query();
    // frame the query based on search string with filter type.
    query =
      e.text !== '' ? query.where('name', 'contains', e.text, true) : query;
    // pass the filter data source, filter query to updateData method.
    e.updateData(this.BPFCs as any, query);
  }
  onChangeBPFCModal(args) {
    this.changebpfcID = args.itemData.id;
  }

  startSteps(): void {
    this.introJS
      .setOptions({
        steps: [
          {
            element: '.step1-li',
            intro: 'Bước 1: Chọn vào nút đổi mã BPFC!'
          },
          {
            element: '.step2-li',
            intro: 'Bước 2: Chọn 1 BPFC khác!'
          },
          // {
          //   element: '#step3-li',
          //   intro: 'let\'s keep going'
          // },
          // {
          //   element: '#step4-li',
          //   intro: 'More features, more fun.'
          // },
          // {
          //   // As you can see, thanks to the element ID
          //   // I can set a step in an element in an other component
          //   element: '#step1',
          //   intro: 'Accessed and element in another component'
          // }
        ],
        hidePrev: true,
        hideNext: false
      })
      .start();
  }

  created() { this.getAllBPFCForChangeModal(); }
  getAllBPFCForChangeModal() {
    // this.bPFCEstablishService.filterByApprovedStatus().subscribe((res: any) => {
    //   this.BPFCsForChangeModal = res.map((item) => {
    //     return {
    //       id: item.id,
    //       name: `${item.modelName} - ${item.modelNo} - ${item.articleNo} - ${item.artProcess}`,
    //     };
    //   });
    // });
  }


  // them code ngay 1 thang 2 2021
  addOvertime(plans, cancelCallback) {
    this.alertify.confirm2('Add Overtime! <br> Cài đặt giờ tăng ca!', 'Are you sure you want to add overtime of this Plans ?<br> Bạn có chắc chắn muốn cài đặt giờ ăn ca không?', () => {
      this.todolistService.addOvertime(plans).subscribe((res: any) => {
        if (res.status === true) {
          this.getAll();
          this.alertify.success(res.message);
        } else {
          this.alertify.error(res.message);
        }
      }, error => {
        this.alertify.error('Lỗi máy chủ!');
      });
    }, () => {
      cancelCallback();
    });
  }
  removeOvertime(plans, cancelCallback) {
    this.alertify.confirm2('remove overtime of this plan <br> Xóa giờ tăng ca của kế hoạc làm việc', 'Are you sure you want to remove overtime of this Plans ?<br> Bạn có chắc chắn muốn hủy giờ tăng cả của kế hoạch làm việc này không?', () => {
      this.todolistService.removeOvertime(plans).subscribe((res: any) => {
        if (res.status === true) {
          this.getAll();
          this.alertify.success(res.message);
        } else {
          this.alertify.error(res.message);
        }
      }, error => {
        this.alertify.error('Lỗi máy chủ!');
      });
    }, () => {
      cancelCallback();
    });
  }

  validateKind() {
    if (this.lineID === 0) {
      this.alertify.warning('Vui lòng chọn chuyền trước!', true);
      this.bpfcID = 0;
      this.bpfcDropdownlist.clear();
    }
    if (this.bpfcKindData.includes(this.kindOfLine) === false) {
      this.alertify.warning('Những hóa chất trong BPFC hiện tại không có chứa kind nào của chuyền hiện tại! Vui lòng chọn lại!', true);
      this.bpfcID = 0;
      this.bpfcDropdownlist.clear();
    }
  }
}
