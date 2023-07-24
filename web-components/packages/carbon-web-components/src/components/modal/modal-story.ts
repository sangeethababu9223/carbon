/**
 * @license
 *
 * Copyright IBM Corp. 2019, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html } from 'lit';
import { boolean, select, text } from '@storybook/addon-knobs';
import '../button/button';
import { MODAL_SIZE } from './modal';
import './index';
import storyDocs from './modal-story.mdx';

const toggleButton = () => {
  document.querySelector('cds-modal')?.toggleAttribute('open');
};

const sizes = {
  [`Extra small size (${MODAL_SIZE.EXTRA_SMALL})`]: MODAL_SIZE.EXTRA_SMALL,
  [`Small size (${MODAL_SIZE.SMALL})`]: MODAL_SIZE.SMALL,
  [`Medium size (${MODAL_SIZE.MEDIUM})`]: MODAL_SIZE.MEDIUM,
  [`Large size (${MODAL_SIZE.LARGE})`]: MODAL_SIZE.LARGE,
};

const buttons = {
  'One (1)': 1,
  'Two (2)': 2,
  'Three (3)': 3,
};

export const Default = () => {
  return html`
    <cds-modal open prevent-close>
      <cds-modal-header>
        <cds-modal-close-button></cds-modal-close-button>
        <cds-modal-label>Account resources</cds-modal-label>
        <cds-modal-heading>Add a custom domain</cds-modal-heading>
      </cds-modal-header>
      <cds-modal-body>
        <cds-modal-body-content description>
          Custom domains direct requests for your apps in this Cloud Foundry
          organization to a URL that you own. A custom domain can be a shared
          domain, a shared subdomain, or a shared domain and host.
        </cds-modal-body-content>
        <cds-form-item>
          <cds-text-input placeholder="e.g. github.com" label="Domain name">
          </cds-text-input>
        </cds-form-item>

        <cds-form-item>
          <cds-select placeholder="US South" label-text="Region">
            <cds-select-item value="us-south">US South</cds-select-item>
            <cds-select-item value="us-east">US East</cds-select-item>
          </cds-select>
        </cds-form-item>

        <cds-dropdown label="Dropdown" title-text="Dropdown">
          <cds-dropdown-item value="one">One</cds-dropdown-item>
          <cds-dropdown-item value="two">Two</cds-dropdown-item>
        </cds-dropdown>

        <cds-multi-select label="Multiselect" title-text="Multiselect">
          <cds-multi-select-item value="option-1"
            >Option 1</cds-multi-select-item
          >
          <cds-multi-select-item value="option-2"
            >Option 2</cds-multi-select-item
          >
        </cds-multi-select>
      </cds-modal-body>
      <cds-modal-footer>
        <cds-modal-footer-button kind="secondary"
          >Cancel</cds-modal-footer-button
        >
        <cds-modal-footer-button>Add</cds-modal-footer-button>
      </cds-modal-footer>
    </cds-modal>
  `;
};

export const DangerModal = () => {
  return html`
    <cds-modal open prevent-close>
      <cds-modal-header>
        <cds-modal-close-button></cds-modal-close-button>
        <cds-modal-label>Account resources</cds-modal-label>
        <cds-modal-heading
          >Are you sure you want to delete this custom
          domain?</cds-modal-heading
        >
      </cds-modal-header>
      <cds-modal-footer>
        <cds-modal-footer-button kind="secondary"
          >Cancel</cds-modal-footer-button
        >
        <cds-modal-footer-button kind="danger">Delete</cds-modal-footer-button>
      </cds-modal-footer>
    </cds-modal>
  `;
};

export const FullWidth = () => {
  return html`
    <cds-modal open full-width prevent-close>
      <cds-modal-header>
        <cds-modal-close-button></cds-modal-close-button>
        <cds-modal-label>An example of a modal with no padding</cds-modal-label>
        <cds-modal-heading>Full Width Modal</cds-modal-heading>
      </cds-modal-header>
      <cds-modal-body>
        <cds-structured-list>
          <cds-structured-list-head>
            <cds-structured-list-header-row>
              <cds-structured-list-header-cell
                >Column A</cds-structured-list-header-cell
              >
              <cds-structured-list-header-cell
                >Column B</cds-structured-list-header-cell
              >
              <cds-structured-list-header-cell
                >Column C</cds-structured-list-header-cell
              >
            </cds-structured-list-header-row>
          </cds-structured-list-head>
          <cds-structured-list-body>
            <cds-structured-list-row>
              <cds-structured-list-cell>Row 1</cds-structured-list-cell>
              <cds-structured-list-cell>Row 1</cds-structured-list-cell>
              <cds-structured-list-cell
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                dui magna, finibus id tortor sed, aliquet bibendum augue. Aenean
                posuere sem vel euismod dignissim. Nulla ut cursus dolor.
                Pellentesque vulputate nisl a porttitor interdum.
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row>
              <cds-structured-list-cell>Row 2</cds-structured-list-cell>
              <cds-structured-list-cell>Row 2</cds-structured-list-cell>
              <cds-structured-list-cell
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                dui magna, finibus id tortor sed, aliquet bibendum augue. Aenean
                posuere sem vel euismod dignissim. Nulla ut cursus dolor.
                Pellentesque vulputate nisl a porttitor interdum.
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row>
              <cds-structured-list-cell>Row 3</cds-structured-list-cell>
              <cds-structured-list-cell>Row 3</cds-structured-list-cell>
              <cds-structured-list-cell
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                dui magna, finibus id tortor sed, aliquet bibendum augue. Aenean
                posuere sem vel euismod dignissim. Nulla ut cursus dolor.
                Pellentesque vulputate nisl a porttitor interdum.
              </cds-structured-list-cell>
            </cds-structured-list-row>
          </cds-structured-list-body>
        </cds-structured-list>
      </cds-modal-body>
      <cds-modal-footer>
        <cds-modal-footer-button kind="secondary"
          >Cancel</cds-modal-footer-button
        >
        <cds-modal-footer-button>Add</cds-modal-footer-button>
      </cds-modal-footer>
    </cds-modal>
  `;
};

export const PassiveModal = () => {
  return html`
    <cds-modal open prevent-close>
      <cds-modal-header>
        <cds-modal-close-button></cds-modal-close-button>
        <cds-modal-heading
          >You have been successfully signed out</cds-modal-heading
        >
      </cds-modal-header>
      <cds-modal-body></cds-modal-body>
    </cds-modal>
  `;
};

export const WithStateManager = () => {
  return html`
    <cds-modal>
      <cds-modal-header>
        <cds-modal-close-button></cds-modal-close-button>
        <cds-modal-label>Account resources</cds-modal-label>
        <cds-modal-heading>Add a custom domain</cds-modal-heading>
      </cds-modal-header>
      <cds-modal-body>
        <cds-modal-body-content description>
          Custom domains direct requests for your apps in this Cloud Foundry
          organization to a URL that you own. A custom domain can be a shared
          domain, a shared subdomain, or a shared domain and host.
        </cds-modal-body-content>
        <cds-form-item>
          <cds-text-input placeholder="e.g. github.com" label="Domain name">
          </cds-text-input>
        </cds-form-item>
        <cds-select label-text="Domain name" placeholder="US South">
          <cds-select-item value="us-south">Option 1</cds-select-item>
          <cds-select-item value="us-east">Option 2</cds-select-item>
        </cds-select>
      </cds-modal-body>
      <cds-modal-footer>
        <cds-modal-footer-button kind="secondary" data-modal-close
          >Cancel</cds-modal-footer-button
        >
        <cds-modal-footer-button>Add</cds-modal-footer-button>
      </cds-modal-footer>
    </cds-modal>
    <cds-button @click="${toggleButton}">Launch modal</cds-button>
  `;
};

export const Playground = (args) => {
  const {
    alert,
    ariaLabel,
    danger,
    open,
    closeButtonLabel,
    hasScrollingContent,
    fullWidth,
    modalHeading,
    modalLabel,
    numberOfButtons,
    passiveModal,
    preventCloseOnClickOutside,
    primaryButtonDisabled,
    size,
  } = args?.['cds-modal'] ?? {};
  return html`
    <cds-modal
      aria-label=${ariaLabel}
      ?prevent-close-on-click-outside=${preventCloseOnClickOutside}
      ?alert=${alert}
      size="${size}"
      ?open=${open}
      ?full-width=${fullWidth}
      prevent-close
      ?has-scrolling-content="${hasScrollingContent}">
      <cds-modal-header>
        <cds-modal-close-button
          close-button-label=${closeButtonLabel}></cds-modal-close-button>
        <cds-modal-label>${modalLabel}</cds-modal-label>
        <cds-modal-heading>${modalHeading}</cds-modal-heading>
      </cds-modal-header>
      <cds-modal-body>
        <cds-modal-body-content description>
          Custom domains direct requests for your apps in this Cloud Foundry
          organization to a URL that you own. A custom domain can be a shared
          domain, a shared subdomain, or a shared domain and host.
        </cds-modal-body-content>
        <cds-form-item>
          <cds-text-input placeholder="e.g. github.com" label="Domain name">
          </cds-text-input>
        </cds-form-item>
        <cds-select label-text="Region" placeholder="US South">
          <cds-select-item value="us-south">Option 1</cds-select-item>
          <cds-select-item value="us-east">Option 2</cds-select-item>
        </cds-select>

        ${hasScrollingContent
          ? html` <cds-modal-body-content>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                id accumsan augue. Phasellus consequat augue vitae tellus
                tincidunt posuere. Curabitur justo urna, consectetur vel elit
                iaculis, ultrices condimentum risus. Nulla facilisi. Etiam
                venenatis molestie tellus. Quisque consectetur non risus eu
                rutrum.
              </cds-modal-body-content>
              <cds-modal-body-content>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                id accumsan augue. Phasellus consequat augue vitae tellus
                tincidunt posuere. Curabitur justo urna, consectetur vel elit
                iaculis, ultrices condimentum risus. Nulla facilisi. Etiam
                venenatis molestie tellus. Quisque consectetur non risus eu
                rutrum.
              </cds-modal-body-content>
              <cds-modal-body-content>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                id accumsan augue. Phasellus consequat augue vitae tellus
                tincidunt posuere. Curabitur justo urna, consectetur vel elit
                iaculis, ultrices condimentum risus. Nulla facilisi. Etiam
                venenatis molestie tellus. Quisque consectetur non risus eu
                rutrum.
              </cds-modal-body-content>
              <h3>Lorem ipsum</h3>
              <cds-modal-body-content>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                id accumsan augue. Phasellus consequat augue vitae tellus
                tincidunt posuere. Curabitur justo urna, consectetur vel elit
                iaculis, ultrices condimentum risus. Nulla facilisi. Etiam
                venenatis molestie tellus. Quisque consectetur non risus eu
                rutrum.
              </cds-modal-body-content>
              <cds-modal-body-content>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                id accumsan augue. Phasellus consequat augue vitae tellus
                tincidunt posuere. Curabitur justo urna, consectetur vel elit
                iaculis, ultrices condimentum risus. Nulla facilisi. Etiam
                venenatis molestie tellus. Quisque consectetur non risus eu
                rutrum.
              </cds-modal-body-content>
              <cds-modal-body-content>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                id accumsan augue. Phasellus consequat augue vitae tellus
                tincidunt posuere. Curabitur justo urna, consectetur vel elit
                iaculis, ultrices condimentum risus. Nulla facilisi. Etiam
                venenatis molestie tellus. Quisque consectetur non risus eu
                rutrum.
              </cds-modal-body-content>
              <cds-modal-body-content>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                id accumsan augue. Phasellus consequat augue vitae tellus
                tincidunt posuere. Curabitur justo urna, consectetur vel elit
                iaculis, ultrices condimentum risus. Nulla facilisi. Etiam
                venenatis molestie tellus. Quisque consectetur non risus eu
                rutrum.
              </cds-modal-body-content>`
          : ``}
      </cds-modal-body>

      ${passiveModal
        ? ``
        : html` <cds-modal-footer>
            ${numberOfButtons > 2
              ? html` <cds-modal-footer-button kind="secondary"
                  >Keep both</cds-modal-footer-button
                >`
              : ``}
            ${numberOfButtons >= 2
              ? html` <cds-modal-footer-button kind="secondary"
                  >${numberOfButtons === 2
                    ? html`Cancel`
                    : 'Rename'}</cds-modal-footer-button
                >`
              : ``}

            <cds-modal-footer-button
              ?disabled=${primaryButtonDisabled}
              kind="${danger ? 'danger' : 'primary'}"
              >Add</cds-modal-footer-button
            >
          </cds-modal-footer>`}
    </cds-modal>
  `;
};

Playground.parameters = {
  ...storyDocs.parameters,
  knobs: {
    'cds-modal': () => ({
      alert: boolean('Alert (alert)', false),
      ariaLabel: text('Aria label (aria-label)', ''),
      closeButtonLabel: text(
        'Close button label (close-button-label)',
        'Close'
      ),
      danger: boolean('Danger mode (danger)', false),
      fullWidth: boolean('Full width (full-width)', false),
      hasScrollingContent: boolean(
        'Has scrolling content (has-scrolling-content)',
        false
      ),
      modalHeading: text('Modal heading', 'Add a custom domain'),
      modalLabel: text('Modal label', ''),
      numberOfButtons: select('Number of buttons', buttons, 2),
      open: boolean('Open (open)', true),
      passiveModal: boolean('Passive modal (passive-modal)', false),
      preventCloseOnClickOutside: boolean(
        'Prevent close on click outside',
        false
      ),
      primaryButtonDisabled: boolean('Primary button disabled', false),
      size: select('Modal size (size)', sizes, null),
    }),
  },
};

export default {
  title: 'Components/Modal',
  decorators: [(story) => html` ${story()} `],
  parameters: {
    ...storyDocs.parameters,
  },
};
