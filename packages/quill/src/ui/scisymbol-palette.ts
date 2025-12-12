import Quill from '../core/quill.js';
import type { Range } from '../core/selection.js';

const SCIENTIFIC_SYMBOLS: Array<{ label: string; value: string }> = [
  { label: 'Alpha', value: 'Α' },
  { label: 'Beta', value: 'Β' },
  { label: 'Gamma', value: 'Γ' },
  { label: 'Delta', value: 'Δ' },
  { label: 'Epsilon', value: 'Ε' },
  { label: 'Zeta', value: 'Ζ' },
  { label: 'Eta', value: 'Η' },
  { label: 'Theta', value: 'Θ' },
  { label: 'Iota', value: 'Ι' },
  { label: 'Kappa', value: 'Κ' },
  { label: 'Lambda', value: 'Λ' },
  { label: 'Mu', value: 'Μ' },
  { label: 'Nu', value: 'Ν' },
  { label: 'Xi', value: 'Ξ' },
  { label: 'Omicron', value: 'Ο' },
  { label: 'Pi', value: 'Π' },
  { label: 'Rho', value: 'Ρ' },
  { label: 'Sigma', value: 'Σ' },
  { label: 'Tau', value: 'Τ' },
  { label: 'Upsilon', value: 'Υ' },
  { label: 'Phi', value: 'Φ' },
  { label: 'Chi', value: 'Χ' },
  { label: 'Psi', value: 'Ψ' },
  { label: 'Omega', value: 'Ω' },
  { label: 'alpha', value: 'α' },
  { label: 'beta', value: 'β' },
  { label: 'gamma', value: 'γ' },
  { label: 'delta', value: 'δ' },
  { label: 'epsilon', value: 'ε' },
  { label: 'zeta', value: 'ζ' },
  { label: 'eta', value: 'η' },
  { label: 'theta', value: 'θ' },
  { label: 'iota', value: 'ι' },
  { label: 'kappa', value: 'κ' },
  { label: 'lambda', value: 'λ' },
  { label: 'mu', value: 'μ' },
  { label: 'nu', value: 'ν' },
  { label: 'xi', value: 'ξ' },
  { label: 'omicron', value: 'ο' },
  { label: 'pi', value: 'π' },
  { label: 'rho', value: 'ρ' },
  { label: 'sigma', value: 'σ' },
  { label: 'tau', value: 'τ' },
  { label: 'upsilon', value: 'υ' },
  { label: 'phi', value: 'φ' },
  { label: 'chi', value: 'χ' },
  { label: 'psi', value: 'ψ' },
  { label: 'omega', value: 'ω' },
];

class SciSymbolPalette {
  quill: Quill;
  button: HTMLButtonElement;
  container: HTMLElement;
  palette: HTMLElement;
  lastRange: Range | null;

  constructor(quill: Quill, button: HTMLButtonElement) {
    this.quill = quill;
    this.button = button;
    this.lastRange = null;

    this.container = document.createElement('span');
    this.container.classList.add('ql-scisymbol-container');
    this.wrapButton();

    this.palette = document.createElement('div');
    this.palette.classList.add('ql-scisymbol-palette');
    this.palette.setAttribute('role', 'listbox');
    this.palette.setAttribute('aria-label', 'Scientific symbols');
    this.palette.setAttribute('aria-hidden', 'true');
    this.buildPalette();
    this.container.appendChild(this.palette);

    this.registerOutsideClick();
  }

  toggle() {
    if (this.container.classList.contains('ql-expanded')) {
      this.close();
    } else {
      this.lastRange = this.quill.getSelection(true);
      this.container.classList.add('ql-expanded');
      this.palette.setAttribute('aria-hidden', 'false');
    }
  }

  close() {
    this.container.classList.remove('ql-expanded');
    this.palette.setAttribute('aria-hidden', 'true');
  }

  private wrapButton() {
    const parent = this.button.parentNode;
    if (parent != null) {
      parent.insertBefore(this.container, this.button);
    }
    this.container.appendChild(this.button);
  }

  private buildPalette() {
    const grid = document.createElement('div');
    grid.classList.add('ql-scisymbol-grid');

    SCIENTIFIC_SYMBOLS.forEach((symbol) => {
      const item = document.createElement('button');
      item.setAttribute('type', 'button');
      item.classList.add('ql-scisymbol-item');
      item.setAttribute('data-value', symbol.value);
      item.setAttribute('aria-label', symbol.label);
      item.textContent = symbol.value;
      item.addEventListener('click', (event) => {
        event.preventDefault();
        this.insertSymbol(symbol.value);
      });
      grid.appendChild(item);
    });

    this.palette.appendChild(grid);
  }

  private insertSymbol(symbol: string) {
    const range = this.lastRange || this.quill.getSelection(true);
    if (range == null) {
      this.close();
      return;
    }

    this.quill.deleteText(range.index, range.length, Quill.sources.USER);
    this.quill.insertText(range.index, symbol, Quill.sources.USER);
    this.quill.setSelection(range.index + symbol.length, Quill.sources.USER);
    this.close();
  }

  private registerOutsideClick() {
    this.quill.emitter.listenDOM(
      'click',
      document.body,
      (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target == null) return;
        if (!this.container.contains(target)) {
          this.close();
        }
      },
    );
  }
}

export default SciSymbolPalette;
