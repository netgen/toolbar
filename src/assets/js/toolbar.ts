import '../scss/toolbar.scss';

const COMPONENTS_BLOCK_TYPE = 'components';
const ITEMS_BLOCK_TYPE = 'items';
const ACTIVE_CLASS = 'active';

class NgToolbar {
  el: HTMLElement;
  toggleButtons: NodeListOf<HTMLButtonElement>;
  editableComponentBlocks: NodeListOf<HTMLElement>;
  editableItemBlocks: NodeListOf<HTMLElement>;
  adminEditUrlBasePath: string | undefined;

  constructor(el: HTMLElement) {
    this.el = el;

    this.toggleButtons = this.el.querySelectorAll('.js-toggle-mode');

    this.editableComponentBlocks = document.querySelectorAll(
      '[data-component-content-id]'
    );
    this.editableItemBlocks = document.querySelectorAll(
      '[data-item-content-id]'
    );
    this.adminEditUrlBasePath = this.formatUrl(
      this.el.dataset.adminEditUrlBasePath
    );

    if (!this.adminEditUrlBasePath) {
      throw new Error('Admin edit url is undefined');
    }

    this.init();
  }

  init() {
    this.toggleButtons.forEach((button) => {
      button.addEventListener('click', () => this.toggleViewMode(button));
    });
  }

  formatUrl(url: string | undefined) {
    if (!url || url.charAt(-1) === '/') return url;

    return `${url}/`;
  }

  getEditableBlocks(blockType: string | undefined) {
    switch (blockType) {
      case ITEMS_BLOCK_TYPE:
        return this.editableItemBlocks;

      case COMPONENTS_BLOCK_TYPE:
        return this.editableComponentBlocks;

      default:
        throw new Error(
          'Block type is not one of: ' +
            [ITEMS_BLOCK_TYPE, COMPONENTS_BLOCK_TYPE].join(' ')
        );
    }
  }

  isButtonActive(button: HTMLButtonElement) {
    return [...button.classList].includes(ACTIVE_CLASS);
  }

  toggleButtonIcon(button: HTMLButtonElement) {
    const toggleButtonIcon = button.querySelector<HTMLImageElement>(
      '.js-toggle-mode-icon'
    );

    if (!toggleButtonIcon) return;

    const iconSrc = this.isButtonActive(button)
      ? button.dataset.iconHideSrc
      : button.dataset.iconShowSrc;

    if (!iconSrc) return;

    toggleButtonIcon.src = iconSrc;
  }

  toggleButtonLabel(button: HTMLButtonElement) {
    const toggleButtonLabel = button.querySelector<HTMLDivElement>(
      '.js-toggle-mode-label'
    );

    if (!toggleButtonLabel) return;

    const buttonLabel = this.isButtonActive(button)
      ? button.dataset.labelHide
      : button.dataset.labelShow;

    if (!buttonLabel) return;

    toggleButtonLabel.innerHTML = buttonLabel;
  }

  toggleButtonActive(button: HTMLButtonElement) {
    button.classList.toggle(ACTIVE_CLASS);
  }

  removeEditButtonIfExists(block: HTMLElement) {
    const editButton = block.querySelector('.js-edit-button');
    const editOutline = block.querySelector('.js-edit-outline');

    if (!editButton || !editOutline) return;

    editButton.remove();
    editOutline.remove();

    if (!block.dataset.initialPosition) return;

    block.style.position = block.dataset.initialPosition;
  }

  addEditButtonIfDoesntExist(block: HTMLElement) {
    const editButton = block.querySelector('.js-edit-button');
    const editOutline = block.querySelector('.js-edit-outline');

    if (editButton && editOutline) return;

    const contentId =
      block.dataset.componentContentId || block.dataset.itemContentId;

    if (!contentId) {
      console.warn(`Content id on ${block} is missing`);
      return;
    }

    block.insertAdjacentHTML('beforeend', this.editButtonMarkup(contentId));

    if (block.style.position)
      block.setAttribute('data-inital-position', block.style.position);

    block.style.position = 'relative';
  }

  toggleViewMode(button: HTMLButtonElement) {
    this.toggleButtonActive(button);

    this.toggleButtonIcon(button);
    this.toggleButtonLabel(button);

    const editableBlocks = this.getEditableBlocks(button.dataset.blockType);
    editableBlocks.forEach((block) => {
      block.classList.toggle('js-editing-enabled');

      this.removeEditButtonIfExists(block);
      this.addEditButtonIfDoesntExist(block);
    });
  }

  get editButtonStyles() {
    return `
            position: absolute;
            top: 1px;
            right: 1.25rem;
            background: #9747FF;
            color: white;
            padding: .5rem;
            z-index: 3;
            cursor:pointer;
            padding: 0.125rem;
            `;
  }
  get editOutlineStyles() {
    return `
      position: absolute;
      z-index: 2;
      inset: 1px;
      pointer-events: none;
      border: 1px dashed #9747FF;
    `;
  }

  editButtonMarkup(contentId: string) {
    const href = `${this.adminEditUrlBasePath}/view/content/${contentId}`;
    return `
      <a href='${href}' target="_blank" style="${this.editButtonStyles}" class="js-edit-button">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="edit_FILL0_wght400_GRAD0_opsz24 1">
              <path id="Vector" d="M6.11111 19.8889H7.61528L17.9333 9.57083L16.4292 8.06667L6.11111 18.3847V19.8889ZM4 22V17.5139L17.9333 3.60694C18.1444 3.41343 18.3775 3.26389 18.6326 3.15833C18.8877 3.05278 19.156 3 19.4375 3C19.719 3 19.9917 3.05278 20.2556 3.15833C20.5194 3.26389 20.7481 3.42222 20.9417 3.63333L22.3931 5.11111C22.6042 5.30463 22.7581 5.53333 22.8549 5.79722C22.9516 6.06111 23 6.325 23 6.58889C23 6.87037 22.9516 7.13866 22.8549 7.39375C22.7581 7.64884 22.6042 7.88194 22.3931 8.09306L8.48611 22H4ZM17.1681 8.83194L16.4292 8.06667L17.9333 9.57083L17.1681 8.83194Z" fill="white"/>
              </g>
          </svg>
      </a>
      <div style="${this.editOutlineStyles}" class="js-edit-outline"></div>
  `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const toolbarEl = document.querySelector<HTMLDivElement>('#ngtoolbar');
  // eslint-disable-next-line no-new
  if (toolbarEl) new NgToolbar(toolbarEl);
});
