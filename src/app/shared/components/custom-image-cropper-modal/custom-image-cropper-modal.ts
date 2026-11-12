import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CustomModal } from '../custom-modal/custom.modal';
import { CustomPrimaryButton } from '../custom-primary-button/custom.primary.button';

/**
 * Reusable 1:1 image cropper modal.
 * Lets users zoom, pan/drag, and preview an uploaded image, then crops it to a clean 1:1 square canvas.
 */
@Component({
  selector: 'app-custom-image-cropper-modal',
  imports: [CustomModal, CustomPrimaryButton],
  templateUrl: './custom-image-cropper-modal.html',
  styleUrl: './custom-image-cropper-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomImageCropperModalComponent {
  readonly open = input<boolean>(false);
  readonly imageSource = input<string | null>(null);
  readonly title = input<string>('Crop Profile Picture');

  readonly cropped = output<string>();
  readonly closed = output<void>();

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('cropCanvas');

  // Zoom & Pan state
  protected readonly zoom = signal<number>(1);
  protected readonly offsetX = signal<number>(0);
  protected readonly offsetY = signal<number>(0);
  protected readonly isDragging = signal<boolean>(false);

  private dragStartX = 0;
  private dragStartY = 0;
  private initialOffsetX = 0;
  private initialOffsetY = 0;

  private activeImg: HTMLImageElement | null = null;

  constructor() {
    afterNextRender(() => {
      this.loadImage();
    });
  }

  private loadImage(): void {
    if (!this.isBrowser) return;
    const src = this.imageSource();
    if (!src) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      this.activeImg = img;
      this.resetTransform();
      this.render();
    };
    img.src = src;
  }

  private resetTransform(): void {
    this.zoom.set(1);
    this.offsetX.set(0);
    this.offsetY.set(0);
  }

  protected onZoomChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.zoom.set(parseFloat(input.value));
    this.render();
  }

  protected onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.initialOffsetX = this.offsetX();
    this.initialOffsetY = this.offsetY();
  }

  protected onMouseMove(event: MouseEvent): void {
    if (!this.isDragging()) return;
    const deltaX = event.clientX - this.dragStartX;
    const deltaY = event.clientY - this.dragStartY;
    this.offsetX.set(this.initialOffsetX + deltaX);
    this.offsetY.set(this.initialOffsetY + deltaY);
    this.render();
  }

  protected onMouseUp(): void {
    this.isDragging.set(false);
  }

  protected onTouchStart(event: TouchEvent): void {
    if (event.touches.length !== 1) return;
    const touch = event.touches[0];
    this.isDragging.set(true);
    this.dragStartX = touch.clientX;
    this.dragStartY = touch.clientY;
    this.initialOffsetX = this.offsetX();
    this.initialOffsetY = this.offsetY();
  }

  protected onTouchMove(event: TouchEvent): void {
    if (!this.isDragging() || event.touches.length !== 1) return;
    const touch = event.touches[0];
    const deltaX = touch.clientX - this.dragStartX;
    const deltaY = touch.clientY - this.dragStartY;
    this.offsetX.set(this.initialOffsetX + deltaX);
    this.offsetY.set(this.initialOffsetY + deltaY);
    this.render();
  }

  protected onTouchEnd(): void {
    this.isDragging.set(false);
  }

  private render(): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas || !this.activeImg) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);

    // Save context before clipping circle
    ctx.save();

    const img = this.activeImg;
    // Calculate base scale to fill the square (1:1 cover)
    const baseScale = Math.max(size / img.naturalWidth, size / img.naturalHeight);
    const finalScale = baseScale * this.zoom();

    const drawW = img.naturalWidth * finalScale;
    const drawH = img.naturalHeight * finalScale;

    // Centered base position + user pan offsets
    const centerX = (size - drawW) / 2 + this.offsetX();
    const centerY = (size - drawH) / 2 + this.offsetY();

    ctx.drawImage(img, centerX, centerY, drawW, drawH);
    ctx.restore();
  }

  protected onApplyCrop(): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;

    // Produce high-res 400x400 1:1 image
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = 400;
    outputCanvas.height = 400;
    const outCtx = outputCanvas.getContext('2d');
    if (!outCtx || !this.activeImg) return;

    const size = 400;
    const ratio = size / canvas.width;
    const img = this.activeImg;
    const baseScale = Math.max(size / img.naturalWidth, size / img.naturalHeight);
    const finalScale = baseScale * this.zoom();

    const drawW = img.naturalWidth * finalScale;
    const drawH = img.naturalHeight * finalScale;

    const centerX = (size - drawW) / 2 + this.offsetX() * ratio;
    const centerY = (size - drawH) / 2 + this.offsetY() * ratio;

    outCtx.drawImage(img, centerX, centerY, drawW, drawH);
    const dataUrl = outputCanvas.toDataURL('image/jpeg', 0.92);
    this.cropped.emit(dataUrl);
    this.close();
  }

  protected close(): void {
    this.resetTransform();
    this.closed.emit();
  }
}
