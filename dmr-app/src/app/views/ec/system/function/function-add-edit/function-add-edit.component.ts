import { PermissionService } from 'src/app/_core/_service/permission.service';
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
@Component({
  selector: 'app-function-add-edit',
  templateUrl: './function-add-edit.component.html',
  styleUrls: ['./function-add-edit.component.scss']
})
export class FunctionAddEditComponent implements OnInit {
  @Input() title: string;
  @Input() function: any;
  fieldsModule: object = { text: 'name', value: 'id' };
  languages: any;
  moduleData: any;
  moduleID: any;
  languageID: any;
  translations = [];
  constructor(
    public activeModal: NgbActiveModal,
    private permissionService: PermissionService,
    private alertify: AlertifyService

  ) { }

  ngOnInit() {
    console.log(this.function);
    this.getAllLanguage();
    this.getAllModule();

  }
  validation() {
    if (this.function.name === '') {
      this.alertify.warning('Please enter function name!', true);
      return false;
    } else {
      return true;
    }
  }
  createFunction() {
    if (this.function.id > 0) {
      this.function.moduleID = this.moduleID;
      this.function.translations = this.translations;
      console.log(this.function);
      this.permissionService.updateFunction(this.function).subscribe(res => {
        this.alertify.success('The function has been updated!!');
        this.activeModal.dismiss();
        this.permissionService.changeMessage(200);
      });
     } else {
      this.function.moduleID = this.moduleID;
      this.function.translations = this.translations;
      console.log(this.function);
      this.permissionService.createFunction(this.function).subscribe(res => {
        this.alertify.success('The function has been created!!');
        this.activeModal.dismiss();
        this.permissionService.changeMessage(200);
      });
    }
  }

  onChangeModule(args) {
    this.moduleID = args.itemData.id;
  }
  getAllLanguage() {
    this.permissionService.getAllLanguage().subscribe(res => {
      this.languages = res;
      if (this.function.id > 0) {
        this.translations = [];
        for (const child of this.function.childNodes) {
          const item = child.entity;
          this.translations.push({
            id: item.parentID,
            name: item.name,
            languageID: item.languageID,
            languageName: this.languages.filter(x => x.id === item.languageID)[0].name
          });
        }
      } else {
        this.translations = [];
        for (const item of this.languages) {
          this.translations.push({
            id: 0,
            name: "",
            languageID: item.id,
            languageName: item.name
          });
        }
      }
    });
  }
  getAllModule() {
    this.permissionService.getAllModule().subscribe((res: any) => {
      this.moduleData = res.map( item => {
        return {
          id: item.id,
          name: item.name
        };
      });
      console.log(res);
    });
  }
}
