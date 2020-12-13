// Find the full example of all available configuration options at
// https://github.com/muenzpraeger/create-lwc-app/blob/main/packages/lwc-services/example/lwc-services.config.js
module.exports = {
	// Default directory for source files
	sourceDir: './lwc',
	// Default server options for watch command
	devServer: {
		port: 3004,
		host: 'localhost',
		open: false,
		stats: 'errors-only',
		noInfo: true,
		contentBase: './lwc'
	},
	// List of resources for copying to the build folder
	resources: [
		{ from: 'lwc/resources/', to: 'dist/resources/' },
		{
			from: 'node_modules/@salesforce-ux/design-system/assets',
			to: 'lwc/SLDS'
		},
		{
			from: 'node_modules/@salesforce-ux/design-system/assets',
			to: 'dist/SLDS'
		},
		{
			from: 'simulator',
			to: 'dist/simulator'
		}
	]
};
