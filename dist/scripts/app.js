"use strict";

function fillTemplate(title, description, elixir_code, js_code) {
  var template = "<div class=\"translation\">\n        <div class=\"translation-description\">\n          <h4>" + title + "</h4>\n          <p>" + description + "</p>\n        </div>\n        <div class=\"row translation-code\">\n          <div class=\"col-md-6\">\n            <h5>Elixir</h5> \n            <pre>\n              <code class=\"elixir\">\n                " + elixir_code + "\n              </code>\n            </pre>        \n          </div>\n          <div class=\"col-md-6\">\n            <h5>JavaScript</h5> \n            <pre>\n              <code class=\"javascript\">\n                " + js_code + "\n              </code>\n            </pre>        \n          </div>\n        </div>\n      </div>\n      <hr/>";

  console.log(template);
  return template;
}

function main() {
  var container = document.getElementsByClassName("container")[0];
  var templates = [];

  hljs.initHighlighting();
}
//# sourceMappingURL=app.js.map