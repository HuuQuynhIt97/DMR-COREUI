import { Modulev2AddEditComponent } from './modulev2/modulev2-add-edit/modulev2-add-edit.component';
import { FunctionAddEditComponent } from './function/function-add-edit/function-add-edit.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ActionFunctionComponent } from './action-function/action-function.component';
import { ActionComponent } from './action/action.component';
import { ModuleComponent } from './module/module.component';
import { FunctionComponent } from './function/function.component';
// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
// Components Routing
import { ECRoutingModule } from './system.routing.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { DropDownListModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Import ngx-barcode module
import { BarcodeGeneratorAllModule, DataMatrixGeneratorAllModule } from '@syncfusion/ej2-angular-barcode-generator';
import { ChartAllModule, AccumulationChartAllModule, RangeNavigatorAllModule } from '@syncfusion/ej2-angular-charts';
import { SwitchModule, RadioButtonModule, CheckBoxModule, CheckBoxAllModule, SwitchAllModule, RadioButtonAllModule } from '@syncfusion/ej2-angular-buttons';

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

import { DialogAllModule, TooltipModule } from '@syncfusion/ej2-angular-popups';
import { DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DatePipe } from '@angular/common';

import { GridAllModule } from '@syncfusion/ej2-angular-grids';

import { L10n, loadCldr, setCulture } from '@syncfusion/ej2-base';

import { TabAllModule, TabModule, ToolbarModule, TreeViewAllModule } from '@syncfusion/ej2-angular-navigations';
import { TreeGridAllModule } from '@syncfusion/ej2-angular-treegrid/';

import { CountdownModule } from 'ngx-countdown';
import { TimePickerModule } from '@progress/kendo-angular-dateinputs';
import { QRCodeModule } from 'angularx-qrcode';
import { VersionComponent } from './version/version.component';
import { VersionAddComponent } from './version/version-add/version-add.component';
import { Modulev2Component } from './modulev2/modulev2.component';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';

// Imported Syncfusion checkbox module from buttons package.
declare var require: any;
let defaultLang: string;
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
if (lang === 'vi') {
  defaultLang = lang;
} else {
  defaultLang = 'en';
}
@NgModule({
  providers: [
    DatePipe
  ],
  imports: [
    QRCodeModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    ECRoutingModule,
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
    CheckBoxAllModule,
    MultiSelectModule,
    CKEditorModule,
    TreeViewAllModule,
    TabAllModule,
    DialogAllModule,
    SwitchAllModule,
    RadioButtonAllModule,
    RichTextEditorAllModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: defaultLang
    }),
  ],
  declarations: [
    ActionComponent,
    FunctionComponent,
    ModuleComponent,
    Modulev2Component,
    ActionFunctionComponent,
    VersionComponent,
    FunctionAddEditComponent,
    Modulev2AddEditComponent,
    VersionAddComponent
  ]
})
export class SystemModule {
  vi: any;
  en: any;
  constructor() {
    if (lang === 'vi') {
      defaultLang = 'vi';
      setTimeout(() => {
        L10n.load(require('../../../../assets/ej2-lang/vi.json'));
        setCulture('vi');
      });
    } else {
      defaultLang = 'en';
      setTimeout(() => {
        L10n.load(require('../../../../assets/ej2-lang/en.json'));
        setCulture('en');
      });
    }
  }
 }
