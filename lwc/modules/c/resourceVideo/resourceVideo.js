import { LightningElement, api } from 'lwc';

export default class ResourceVideo extends LightningElement {
	@api videoId;
	@api videoLabel;

	get url() {
		return `https://www.youtube.com/embed/${this.videoId}`;
	}
}
