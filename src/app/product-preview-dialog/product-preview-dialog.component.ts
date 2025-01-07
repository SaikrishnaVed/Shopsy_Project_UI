import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ChangeDetectionStrategy, inject} from '@angular/core';

@Component({
  selector: 'app-product-preview-dialog',
  templateUrl: './product-preview-dialog.component.html',
  styleUrls: ['./product-preview-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPreviewDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ProductPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
