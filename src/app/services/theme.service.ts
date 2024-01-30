import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentTheme = 'light';
  private renderer: Renderer2;

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  getCurrentTheme(): string {
    return this.currentTheme;
  }

  setCurrentTheme(theme: string): void {
    // Xóa các file CSS theme hiện tại
    this.removeThemeStyles();

    // Thêm file CSS theme mới
    this.addThemeStyles(theme);

    this.currentTheme = theme;
  }

  private addThemeStyles(theme: string): void {
    const linkElement = this.renderer.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = `assets/themes/theme_${theme}.css`;
    this.renderer.appendChild(document.head, linkElement);
  }
  private removeThemeStyles(): void {
    const existingLinks = document.head.querySelectorAll(
      'link[rel="stylesheet"]'
    );
    existingLinks.forEach((link: Element) => {
      const linkElement = link as HTMLLinkElement;
      if (linkElement.href.includes('/assets/themes/theme_')) {
        this.renderer.removeChild(document.head, linkElement);
      }
    });
  }

  // private removeThemeStyles(): void {
  //   const existingLinks = document.head.querySelectorAll(
  //     'link[rel="stylesheet"]'
  //   );
  //   existingLinks.forEach((link: HTMLLinkElement) => {
  //     if (link.href.includes('/assets/themes/theme_')) {
  //       this.renderer.removeChild(document.head, link);
  //     }
  //   });
  // }
}
