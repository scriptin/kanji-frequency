var generalInfo = _.template(
  '<dl>' +
    '<dt><%- name %></dt>' +
      '<dd>' +
      '<%- description %>' +
      '<ul class="list-unstyled">' +
        '<li>kanji total: <code><%- kanjiTotalCount %></code></li>' +
        '<li>kanji distinct: <code><%- kanjiDistinctCount %></code></li>' +
      '</ul>' +
    '</dd>' +
  '</dl>'
);
