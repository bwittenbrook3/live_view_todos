import { LitElement, html } from 'lit-element'
import { sendLiveSocketEvent } from '../utils/websocket'

const moment = require('moment');
require('moment-timezone')

export class LocalTime extends LitElement {

  static get properties() {
    return {
      time: { type: String },
      phxOnClick: {type: String},
      format: { type: String }
    };
  }

  constructor() {
    super();
    this.time = new Date;
    this.format = "MMMM Do YYYY, h:mm:ss a";
  }

  connectedCallback() {
    super.connectedCallback();
    this.sendOnceLoaded()
  }

  async sendOnceLoaded() {
    sendLiveSocketEvent(this, "mounted")
  }

  _handleClick() {
    if (this.phxOnClick) {
      sendLiveSocketEvent(this, this.phxOnClick)
    }
  }

  render() {
    return html`
      <p>${
        moment(this.time)
        .tz(moment.tz.guess())
        .format(this.format)

      }
      </p>

      <button @click=${this._handleClick}>
        click me
      </button>
    `
  }
}

customElements.define('local-time', LocalTime);
