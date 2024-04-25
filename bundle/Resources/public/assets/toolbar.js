const s="components",l="items",r="active";class d{constructor(t){if(this.el=t,this.toggleButtons=this.el.querySelectorAll(".js-toggle-mode"),this.editableComponentBlocks=document.querySelectorAll("[data-component-admin-id]"),this.editableItemBlocks=document.querySelectorAll("[data-item-admin-id]"),this.adminUrlTemplate=this.el.dataset.adminUrlTemplate,!this.adminUrlTemplate)throw new Error("Admin edit url is undefined");this.init()}init(){this.toggleButtons.forEach(t=>{t.addEventListener("click",()=>this.toggleViewMode(t))})}getEditableBlocks(t){switch(t){case l:return this.editableItemBlocks;case s:return this.editableComponentBlocks;default:throw new Error("Block type is not one of: "+[l,s].join(" "))}}isButtonActive(t){return[...t.classList].includes(r)}toggleButtonIcon(t){const i=t.querySelector(".js-toggle-mode-icon");if(!i)return;const e=this.isButtonActive(t)?t.dataset.iconHideSrc:t.dataset.iconShowSrc;e&&(i.src=e)}toggleButtonLabel(t){const i=t.querySelector(".js-toggle-mode-label");if(!i)return;const e=this.isButtonActive(t)?t.dataset.labelHide:t.dataset.labelShow;e&&(i.innerHTML=e)}toggleButtonActive(t){t.classList.toggle(r)}removeEditButtonIfExists(t){const i=t.querySelector(".js-edit-button"),e=t.querySelector(".js-edit-outline");!i||!e||(i.remove(),e.remove(),t.dataset.initialPosition&&(t.style.position=t.dataset.initialPosition))}addEditButtonIfDoesntExist(t){const i=t.querySelector(".js-edit-button"),e=t.querySelector(".js-edit-outline");if(i&&e)return;const n=t.dataset.componentAdminId||t.dataset.itemAdminId;if(!n){console.warn(`Admin (content/location) id on ${t} is missing`);return}t.insertAdjacentHTML("beforeend",this.editButtonMarkup(n)),t.style.position&&t.setAttribute("data-inital-position",t.style.position),t.style.position="relative"}toggleViewMode(t){this.toggleButtonActive(t),this.toggleButtonIcon(t),this.toggleButtonLabel(t),this.getEditableBlocks(t.dataset.blockType).forEach(e=>{e.classList.toggle("js-editing-enabled"),this.removeEditButtonIfExists(e),this.addEditButtonIfDoesntExist(e)})}get editButtonStyles(){return`
        position: absolute;
        top: 1px;
        right: 1.25rem;
        background: #9747FF;
        color: white;
        padding: .5rem;
        z-index: 3;
        cursor:pointer;
        padding: 0.125rem;
    `}get editOutlineStyles(){return`
      position: absolute;
      z-index: 2;
      inset: 1px;
      pointer-events: none;
      border: 1px dashed #9747FF;
    `}editButtonMarkup(t){var e;return`
      <a href='${(e=this.adminUrlTemplate)==null?void 0:e.replace("{contentId}",t).replace("{locationId}",t)}' target="_blank" style="${this.editButtonStyles}" class="js-edit-button">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="edit_FILL0_wght400_GRAD0_opsz24 1">
              <path id="Vector" d="M6.11111 19.8889H7.61528L17.9333 9.57083L16.4292 8.06667L6.11111 18.3847V19.8889ZM4 22V17.5139L17.9333 3.60694C18.1444 3.41343 18.3775 3.26389 18.6326 3.15833C18.8877 3.05278 19.156 3 19.4375 3C19.719 3 19.9917 3.05278 20.2556 3.15833C20.5194 3.26389 20.7481 3.42222 20.9417 3.63333L22.3931 5.11111C22.6042 5.30463 22.7581 5.53333 22.8549 5.79722C22.9516 6.06111 23 6.325 23 6.58889C23 6.87037 22.9516 7.13866 22.8549 7.39375C22.7581 7.64884 22.6042 7.88194 22.3931 8.09306L8.48611 22H4ZM17.1681 8.83194L16.4292 8.06667L17.9333 9.57083L17.1681 8.83194Z" fill="white"/>
              </g>
          </svg>
      </a>
      <div style="${this.editOutlineStyles}" class="js-edit-outline"></div>
  `}}document.addEventListener("DOMContentLoaded",()=>{const o=document.querySelector("#ngtoolbar");o&&new d(o)});
