import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Isolates animated or complex subtrees into a dedicated GPU compositor and
 * layout/paint containment boundary (the web equivalent of Flutter's RepaintBoundary).
 *
 * Keep `clip` false when child elements intentionally overhang the container bounds;
 * set `clip` to true to enable strict paint containment (`contain: layout paint style`).
 */
@Component({
  selector: 'app-repaint-boundary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'repaint-boundary',
    '[class.repaint-boundary--clip]': 'clip()',
  },
  template: '<ng-content />',
  styles: `
    :host {
      display: block;
      contain: layout style;
      isolation: isolate;
      transform: translateZ(0);
      backface-visibility: hidden;
    }

    :host(.repaint-boundary--clip) {
      contain: layout paint style;
      overflow: hidden;
    }
  `,
})
export class RepaintBoundaryComponent {
  readonly clip = input<boolean>(false);
}

