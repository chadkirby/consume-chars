module.exports = consumeChars;

function consumeChars($, $el, count) {
  if (!count) {
    return;
  }
  $el.contents().each(function(ii, el) {
    if (!count) {
      return;
    }
    if (isTextNode(el)) {
      let text = $(el).text();
      if (text.length > count) {
        $(el).replaceWith(text.slice(count));
        count = 0;
      } else {
        let $parent = $(el).parent();
        $(el).remove();
        if (!$parent.contents().length) {
          $parent.remove();
        }
        count -= text.length;
      }
    } else {
      count = consumeChars($, $(el), count);
    }
  });
  return count;
}

function isTextNode(el) {
  return el.nodeType === 3 || el.type === 'text';
}
