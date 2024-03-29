import { AdditionComponent } from './addition/addition.component';
import { AutoSelectDirective } from './../select.directive';
import { CoreDirectivesModule } from './../../../_core/_directive/core.directives.module';
// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HostListener, NgModule, OnInit } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
// Components Routing
import { NgSelectModule } from '@ng-select/ng-select';

import { DropDownListAllModule, DropDownListModule, MultiSelectAllModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Import ngx-barcode module
import { BarcodeGeneratorAllModule, DataMatrixGeneratorAllModule } from '@syncfusion/ej2-angular-barcode-generator';
import { ChartAllModule, AccumulationChartAllModule, RangeNavigatorAllModule } from '@syncfusion/ej2-angular-charts';
import { SwitchModule, RadioButtonModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';

import { ButtonModule } from '@syncfusion/ej2-angular-buttons';

import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';

import { QRCodeGeneratorAllModule } from '@syncfusion/ej2-angular-barcode-generator';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

import { TooltipModule } from '@syncfusion/ej2-angular-popups';
import { DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DatePipe } from '@angular/common';

import { GridAllModule } from '@syncfusion/ej2-angular-grids';

import { L10n, loadCldr, setCulture } from '@syncfusion/ej2-base';

import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { TreeGridAllModule } from '@syncfusion/ej2-angular-treegrid/';

import { CountdownModule } from 'ngx-countdown';
import { TimePickerModule } from '@progress/kendo-angular-dateinputs';
import { QRCodeModule } from 'angularx-qrcode';
import { ExecutionRoutingModule } from './execution.routing.module';


import {
  GlueHistoryComponent, IncomingComponent, MixingComponent,
  PlanComponent, PlanOutputQuantityComponent, ShakeComponent,
  StirComponent, TodolistComponent,
  PrintGlueDispatchListComponent, DispatchComponent, PrintGlueComponent,
  SubpackageComponent,
  DispatchDoneListComponent,
  DispatchEVAUVComponent
} from ".";
import { SearchDirective } from '../search.directive';
import { FocusDirectivesModule } from 'src/app/_core/_directive/focus.directives.module';
import { AutoSelectSubpackageDirective } from '../select.subpackage.directive';
import { AutofocusSubpackageDirective } from '../focus.subpackage.directive';
declare var require: any;
const lang = localStorage.getItem('lang');
loadCldr(
  require('cldr-data/supplemental/numberingSystems.json'),
  require('cldr-data/main/en/ca-gregorian.json'),
  require('cldr-data/main/en/numbers.json'),
  require('cldr-data/main/en/timeZoneNames.json'),
  require('cldr-data/supplemental/weekdata.json')); // To load the culture based first day of week

loadCldr(
  require('cldr-data/supplemental/numberingSystems.json'),
  require('cldr-data/main/vi/ca-gregorian.json'),
  require('cldr-data/main/vi/numbers.json'),
  require('cldr-data/main/vi/timeZoneNames.json'),
  require('cldr-data/supplemental/weekdata.json')); // To load the culture based first day of week

@NgModule({
  providers: [
    DatePipe
  ],
  imports: [
    QRCodeModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    ExecutionRoutingModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgSelectModule,
    DropDownListModule,
    NgbModule,
    ChartAllModule,
    AccumulationChartAllModule,
    RangeNavigatorAllModule,
    BarcodeGeneratorAllModule,
    QRCodeGeneratorAllModule,
    DataMatrixGeneratorAllModule,
    SwitchModule,
    MaskedTextBoxModule,
    DatePickerModule,
    TreeGridAllModule,
    GridAllModule,
    RadioButtonModule,
    TooltipModule,
    TimePickerModule,
    Ng2SearchPipeModule,
    DateTimePickerModule,
    CountdownModule,
    ToolbarModule,
    CheckBoxModule,
    MultiSelectAllModule,
    DropDownListAllModule,
    CoreDirectivesModule,
    FocusDirectivesModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: lang
    }),
  ],
  declarations: [
    GlueHistoryComponent, MixingComponent,
    PlanComponent, PlanOutputQuantityComponent, ShakeComponent,
    StirComponent, TodolistComponent,
    PrintGlueDispatchListComponent, DispatchComponent,
    PrintGlueComponent,
    SubpackageComponent,
    DispatchEVAUVComponent,
    IncomingComponent,
    DispatchDoneListComponent,
    SearchDirective,
    AutoSelectDirective,
    AutoSelectSubpackageDirective,
    AutofocusSubpackageDirective,
    AdditionComponent
  ]
})
export class ExecutionModule {
  constructor() {
    if (lang === 'vi') {
      setTimeout(() => {
        L10n.load(require('../../../../assets/ej2-lang/vi.json'));
        setCulture('vi');
      });
    } else {
      setTimeout(() => {
        L10n.load(require('../../../../assets/ej2-lang/en.json'));
        setCulture('en');
      });
    }
  }
}
