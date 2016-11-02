let cheerio = require('cheerio');
let jsdom = require('jsdom').jsdom;
let jquery = require('jquery');

let test = require('./get-test')();
let consumeChars = require('../src/index');

test('consumeChars exports something', function(assert) {
  assert.equal(typeof consumeChars, `function`, `consumeChars function exists`);
  assert.end();
});

test('consumeChars consumes chars with cheerio', function(assert) {
  let $ = cheerio.load('<html><body></body></html>');
  $('body').append(`<h1>123456789</h1>`);
  consumeChars($, $('h1'), 5);
  assert.equal(
    $.html('h1'),
    `<h1>6789</h1>`
  );

  $('body').append(`<h2><s>12</s><u>3456</u>789</h2>`);
  consumeChars($, $('h2'), 5);
  assert.equal(
    $.html('h2'),
    `<h2><u>6</u>789</h2>`
  );

  $('body').append(`<h3><a>1<b>2<c>3<d>4<e>5<f>6</f>7</e>8</d>9</c></b></a></h3>`);
  consumeChars($, $('h3'), 5);
  assert.equal(
    $.html('h3'),
    `<h3><a><b><c><d><e><f>6</f>7</e>8</d>9</c></b></a></h3>`
  );

  assert.end();
});

test('consumeChars consumes chars with jquery', function(assert) {
  let dom = jsdom('<html><body></body></html>');
  let $ = jquery(dom.defaultView);

  let $el = $($.parseHTML(`<div>123456789</div>`));
  consumeChars($, $el, 5);
  assert.equal(
    $el.html(),
    `6789`
  );

  $el = $($.parseHTML(`<div><s>12</s><u>3456</u>789</div>`));
  consumeChars($, $el, 5);
  assert.equal(
    $el.html(),
    `<u>6</u>789`
  );

  $el = $($.parseHTML(`<div><a>1<b>2<c>3<d>4<e>5<f>6</f>7</e>8</d>9</c></b></a></div>`));
  consumeChars($, $el, 5);
  assert.equal(
    $el.html(),
    `<a><b><c><d><e><f>6</f>7</e>8</d>9</c></b></a>`
  );

  assert.end();
});
