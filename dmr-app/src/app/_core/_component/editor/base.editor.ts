import { Component, ViewChild } from "@angular/core";
import { RichTextEditorComponent } from '@syncfusion/ej2-angular-richtexteditor';
import { FileManagerSettingsModel, QuickToolbarSettingsModel } from '@syncfusion/ej2-angular-richtexteditor';

import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';

@Component({
  template: ''
})
export abstract class BaseEditor {
  @ViewChild('toolsRTE')
  public rteObj: RichTextEditorComponent;

  private hostUrl: string = 'https://ej2-aspcore-service.azurewebsites.net/';

  public tools: ToolbarModule = {
    items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
      'LowerCase', 'UpperCase', 'SuperScript', 'SubScript', '|',
      'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
      'Outdent', 'Indent', '|',
      'CreateTable', 'CreateLink', '|', 'ClearFormat', 'Print',
      'SourceCode', '|', 'Undo', 'Redo']
  };

  public fileManagerSettings: FileManagerSettingsModel = {
    enable: true,
    path: '/Pictures/Food',
    ajaxSettings: {
      url: this.hostUrl + 'api/FileManager/FileOperations',
      getImageUrl: this.hostUrl + 'api/FileManager/GetImage',
      uploadUrl: this.hostUrl + 'api/FileManager/Upload',
      downloadUrl: this.hostUrl + 'api/FileManager/Download'
    }
  };

  public quickToolbarSettings: QuickToolbarSettingsModel = {
    table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', '-', 'BackgroundColor', 'TableRemove', 'TableCellVerticalAlign', 'Styles']
  };

  public maxLength = 2000;
  public textArea: HTMLElement;

}
