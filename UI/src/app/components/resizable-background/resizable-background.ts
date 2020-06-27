export class ResizableBackground {
    private originalHeight = 0;
    private originalWidth = 0;
    private originalScale = 0;
    public Height = 0;
    public Width = 0;
    constructor(originalWidth, originalHeight) {
      this.originalHeight = originalHeight;
      this.originalWidth = originalWidth;
      this.originalScale = originalWidth / originalHeight;
      this.Height = this.originalHeight;
      this.Width = this.originalWidth;
    }
    windowResized(newWidth, newHeight) {
      if ((this.originalScale * newHeight) > newWidth) {
        this.Height = newHeight;
        this.Width = this.originalScale * this.Height;
      } else {
        this.Width = newWidth;
        this.Height = this.Width / this.originalScale;
      }
    }
    relativeXRatio() {
      return this.Width / this.originalWidth;
    }
    relativeYRatio() {
      return this.Height / this.originalHeight;
    }
  }
