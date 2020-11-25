class SlidesCode {
	async initialize(Reveal) {
		let data = await Reveal.initialize({
			width: 1280,
			height: 720,
			margin: 0.05,

			hash: true,
			controls: true,
			progress: false,
			mouseWheel: false,
			showNotes: false,
			slideNumber: false,
			fragmentInURL: false,

			autoSlide: 0,
			autoSlideStoppable: true,

			autoAnimateMatcher: SL.deck.AutoAnimate.matcher,

			center: false,
			shuffle: false,
			loop: false,
			rtl: false,
			navigationMode: "default",

			transition: "slide",
			backgroundTransition: "slide",

			highlight: {
				escapeHTML: false,
			},

			plugins: [RevealZoom, RevealNotes, RevealMarkdown, RevealHighlight],
		});
		return data;
	}
}
