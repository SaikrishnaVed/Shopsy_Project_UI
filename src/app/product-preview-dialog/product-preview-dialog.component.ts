import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ChangeDetectionStrategy, inject} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-product-preview-dialog',
  templateUrl: './product-preview-dialog.component.html',
  styleUrls: ['./product-preview-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPreviewDialogComponent {

  fileUrl = 'assets/Documents/ProductList_1.pdf';
  private iframeLoaded = false; // Flag to prevent multiple calls

  constructor(
    public dialogRef: MatDialogRef<ProductPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private sanitise: DomSanitizer
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  cleanUrl(url){
    return this.sanitise.bypassSecurityTrustResourceUrl(url);
  }

}