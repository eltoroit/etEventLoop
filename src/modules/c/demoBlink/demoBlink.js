import { LightningElement } from 'lwc';

export default class DemoBlink extends LightningElement {
    isVisible = true;

    onShowImage() {
        this._updateUI(true);
    }

    onHideImage() {
        this._updateUI(false);
    }

    onFlip() {
        this._updateUI(!this.isVisible);
    }

    _updateUI(isVisible) {
        this.isVisible = isVisible;
        let image = this.template.querySelector('img[data-id="image"]');
        image.style.visibility = isVisible ? 'visible' : 'hidden';
    }
}
