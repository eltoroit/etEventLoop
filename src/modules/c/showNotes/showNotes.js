import { LightningElement } from 'lwc';

export default class ShowNotes extends LightningElement {
    onSlotChange() {
        const slot = this.template.querySelector(`[data-id="slot"]`);
        if (slot) {
            let lis = slot.assignedNodes();
            lis.forEach((li) => {
                li.classList.add('slds-text-heading_small');
                li.classList.add('slds-p-bottom_x-small');
            });
        }
    }
}
