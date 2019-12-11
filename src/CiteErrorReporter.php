<?php

namespace Cite;

use Html;
use Language;
use Parser;
use Sanitizer;

/**
 * @license GPL-2.0-or-later
 */
class CiteErrorReporter {

	/**
	 * @var Parser
	 */
	private $parser;

	/**
	 * @var Language
	 */
	private $language;

	/**
	 * @param Language $language
	 * @param Parser $parser
	 */
	public function __construct( Language $language, Parser $parser ) {
		$this->language = $language;
		$this->parser = $parser;
	}

	/**
	 * @param string $key Message name of the error or warning
	 * @param mixed ...$params
	 *
	 * @return string Half-parsed wikitext with extension's tags already being expanded
	 */
	public function halfParsed( $key, ...$params ) {
		// FIXME: We suspect this is not necessary and can just be removed
		return $this->parser->recursiveTagParse( $this->plain( $key, ...$params ) );
	}

	/**
	 * @param string $key Message name of the error or warning
	 * @param mixed ...$params
	 *
	 * @return string Plain, unparsed wikitext
	 * @return-taint tainted
	 */
	public function plain( $key, ...$params ) {
		$msg = wfMessage( $key, ...$params )->inLanguage( $this->language );

		if ( strncmp( $msg->getKey(), 'cite_warning_', 13 ) === 0 ) {
			$type = 'warning';
			$id = substr( $msg->getKey(), 13 );
			$extraClass = ' mw-ext-cite-warning-' . Sanitizer::escapeClass( $id );
		} else {
			$type = 'error';
			$extraClass = '';

			// Take care; this is a sideeffect that might not belong to this class.
			$this->parser->addTrackingCategory( 'cite-tracking-category-cite-error' );
		}

		return Html::rawElement(
			'span',
			[
				'class' => "$type mw-ext-cite-$type" . $extraClass,
				'lang' => $this->language->getHtmlCode(),
				'dir' => $this->language->getDir(),
			],
			wfMessage( "cite_$type", $msg->plain() )->inLanguage( $this->language )->plain()
		);
	}

}
