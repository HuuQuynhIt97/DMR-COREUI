import { PermissionService } from 'src/app/_core/_service/permission.service';
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
@Component({
  selector: 'app-modulev2-add-edit',
  templateUrl: './modulev2-add-edit.component.html',
  styleUrls: ['./modulev2-add-edit.component.scss']
})
export class Modulev2AddEditComponent implements OnInit {
  @Input() title: string;
  @Input() module: any;
  fieldsModule: object = { text: 'name', value: 'id' };
  languages: any;
  languageID: any;
  translations = [];
  constructor(
    public activeModal: NgbActiveModal,
    private permissionService: PermissionService,
    private alertify: AlertifyService

  ) { }

  ngOnInit() {
    console.log(this.module);
    this.getAllLanguage();

  }
  validation() {
    if (this.module.name === '') {
      this.alertify.warning('Please enter module name!', true);
      return false;
    } else {
      return true;
    }
  }
  createModule() {
    if (this.module.id > 0) {
      this.module.translations = this.translations;
      console.log(this.module);
      this.permissionService.updateModule(this.module).subscribe(res => {
        this.alertify.success('The module has been updated!!');
        this.activeModal.dismiss();
        this.permissionService.changeMessage(200);
      });
    } else {
      this.module.translations = this.translations;
      console.log(this.module);
      this.permissionService.createModule(this.module).subscribe(res => {
        this.alertify.success('The module has been created!!');
        this.activeModal.dismiss();
        this.permissionService.changeMessage(200);
      });
    }
  }

  getAllLanguage() {
    this.permissionService.getAllLanguage().subscribe(res => {
      this.languages = res;
      if (this.module.id > 0) {
        this.translations = [];
        for (const child of this.module.childNodes) {
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
}
