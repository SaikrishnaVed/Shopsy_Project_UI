import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDynamicAlign]'
})
export class DynamicAlignDirective implements OnChanges {
  @Input('appDynamicAlign') value: any; // Input value to check for numeric or text

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    this.applyAlignment();
  }

  private applyAlignment(): void {
    // Remove any existing alignment classes
    this.renderer.removeClass(this.el.nativeElement, 'text-cell');
    this.renderer.removeClass(this.el.nativeElement, 'numeric-cell');

    // Determine alignment and apply the corresponding class
    if (!isNaN(parseFloat(this.value)) && isFinite(this.value)) {
      this.renderer.addClass(this.el.nativeElement, 'numeric-cell'); // Right-align for numbers
    } else {
      this.renderer.addClass(this.el.nativeElement, 'text-cell'); // Left-align for text
    }
  }
}