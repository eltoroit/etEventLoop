import { LightningElement, api } from 'lwc';

export default class ResourceVideo extends LightningElement {
	@api videoId;
	@api videoLabel;
	@api scale = 1;

	videoSize = { w: 560, h: 315 };

	get width() {
		return Math.round(this.videoSize.w * this.scale);
	}

	get height() {
		return Math.round(this.videoSize.h * this.scale);
	}

	get url() {
		return `https://www.youtube-nocookie.com/embed/${this.videoId}`;
	}
}
