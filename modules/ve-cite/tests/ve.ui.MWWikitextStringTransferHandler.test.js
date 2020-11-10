/*!
 * VisualEditor UserInterface MWWikitextStringTransferHandler tests.
 *
 * @copyright 2011-2018 VisualEditor Team's Cite sub-team and others; see AUTHORS.txt
 * @license MIT
 */

QUnit.module( 've.ui.MWWikitextStringTransferHandler (Cite)', QUnit.newMwEnvironment( {
	beforeEach: function () {
		// Mock XHR for mw.Api()
		this.server = this.sandbox.useFakeServer();
		ve.test.utils.mwEnvironment.setup.call( this );
	},
	afterEach: ve.test.utils.mwEnvironment.teardown
} ) );

/* Tests */

QUnit.test( 'convert', function ( assert ) {
	var i,
		cases = [
			{
				msg: 'Simple reference',
				pasteString: '<ref>Foo</ref>',
				pasteType: 'text/plain',
				parsoidResponse: '<p><span about="#mwt2" class="mw-ref reference" id="cite_ref-1" rel="dc:references" typeof="mw:Extension/ref" data-mw=\'{"name":"ref","body":{"id":"mw-reference-text-cite_note-1"},"attrs":{}}\'>[1]</span></p>' +
					'<ol class="mw-references" typeof="mw:Extension/references" about="#mwt3" data-mw=\'{"name":"references","attrs":{},"autoGenerated":true}\'>' +
						'<li about="#cite_note-1" id="cite_note-1">↑ <span id="mw-reference-text-cite_note-1" class="mw-reference-text">Foo</span></li>' +
					'</ol>',
				annotations: [],
				expectedData: [
					{ type: 'paragraph' },
					{
						type: 'mwReference',
						attributes: {
							listGroup: 'mwReference/',
							listIndex: 0,
							listKey: 'auto/0',
							refGroup: '',
							refListItemId: 'mw-reference-text-cite_note-1'
						}
					},
					{ type: '/mwReference' },
					{ type: '/paragraph' },
					{ type: 'internalList' },
					{ type: 'internalItem' },
					{ type: 'paragraph', internal: { generated: 'wrapper' } },
					'F', 'o', 'o',
					{ type: '/paragraph' },
					{ type: '/internalItem' },
					{ type: '/internalList' }
				]
			},
			{
				msg: 'Reference template with autoGenerated content',
				pasteString: '{{reference}}',
				pasteType: 'text/plain',
				parsoidResponse: '<p><span typeof="mw:Transclusion">[1]</span></p>' +
					'<ol class="mw-references" typeof="mw:Extension/references" about="#mwt3" data-mw=\'{"name":"references","attrs":{},"autoGenerated":true}\'>' +
						'<li>Reference list</li>' +
					'</ol>',
				annotations: [],
				expectedData: [
					{ type: 'paragraph' },
					{
						type: 'mwTransclusionInline',
						attributes: {
							mw: {}
						}
					},
					{
						type: '/mwTransclusionInline'
					},
					{ type: '/paragraph' },
					{ type: 'internalList' },
					{ type: '/internalList' }
				]
			}
		];

	for ( i = 0; i < cases.length; i++ ) {
		ve.test.utils.runWikitextStringHandlerTest(
			assert, this.server, cases[ i ].pasteString, cases[ i ].pasteType,
			cases[ i ].parsoidResponse, cases[ i ].expectedData, cases[ i ].annotations,
			cases[ i ].assertDom, cases[ i ].msg
		);
	}
} );
