import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css']
})
export class DocumentUploadComponent implements OnInit {

  selectedFile: File | null = null;
  isLoading = false;
  document: Document = {
    Id: 0,
    Name: '',
    DocumentPath: ''
  };

  constructor(private appService: AppService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {}

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(form: any): void {
    this.isLoading = true;

    const document = {
      id: this.document.Id,
      name: this.document.Name,
      documentPath: this.selectedFile ? this.selectedFile.name : ''
    };

    if (form.valid) {
      if (this.document.Id) {
        // Update document
        this.appService.UploadDocument(document).subscribe({
          next: () => {
            this.isLoading = false;
            alert('Document updated successfully!');
            sessionStorage.removeItem('editDocument');
            this.router.navigate(['/upload-document']);
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Error updating document', err);
            alert('Failed to update document. Please try again.');
          }
        });
      } else {
        // Add new document
        this.appService.UploadDocument(document).subscribe({
          next: () => {
            this.isLoading = false;
            alert('Document uploaded successfully!');
            sessionStorage.removeItem('editDocument');
            this.onReset(form);
            // this.document.DocumentPath = '';
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Error uploading document', err);
            alert('Failed to add document. Please try again.');
          }
        });
      }
    } else {
      this.isLoading = false;
      alert('Please fill all required fields correctly.');
    }
  }

  onReset(form: any): void {
    form.reset();
    this.selectedFile = null;
    this.document = {
      Id: 0,
      Name: '',
      DocumentPath: ''
    };
  }
}

export class Document {
  Id: number;
  Name: string;
  DocumentPath: string;
}
