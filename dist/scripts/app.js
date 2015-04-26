"use strict";

function fillTemplate(title, description, elixir_code, js_code) {
  var template = "<div class=\"translation\">\n        <div class=\"translation-description\">\n          <h4>" + title + "</h4>\n          <p>" + description + "</p>\n        </div>\n        <div class=\"row translation-code\">\n          <div class=\"col-md-6\">\n            <h5>Elixir</h5> \n            <pre>\n              <code class=\"elixir\">\n                " + elixir_code + "\n              </code>\n            </pre>        \n          </div>\n          <div class=\"col-md-6\">\n            <h5>JavaScript</h5> \n            <pre>\n              <code class=\"javascript\">\n                " + js_code + "\n              </code>\n            </pre>        \n          </div>\n        </div>\n      </div>\n      <hr/>";

  console.log(template);
  return template;
}

function main() {
  var container = document.getElementsByClassName("container")[0];
  var templates = [];

  var template = fillTemplate("primatives", "Here is how primatives are translated..", "\n    nil\n    1\n    -1.0\n    \"Hello\"\n    \"Hello #{length([])}\"\n    :atom\n    [1,2,3]\n    {1,2,3}", "\n    null\n    1\n    -1.0\n    'Hello'\n    'Hello ' + Kernel.to_string(Kernel.length([]))\n    Atom('atom')\n    [1,2,3]\n    Tuple(1, 2, 3)");
  templates.push(template);

  template = fillTemplate("Assignment Patterns", "Assignment patterns are translated into assignment statements.", "\n    a = 1\n    {a,b} = {1,2}\n    ", "\n    let a = 1;\n    let _ref = Tuple(1, 2);\n    let a = _ref[0];\n    let b = _ref[1];\n    ");
  templates.push(template);

  template = fillTemplate("def and defp", "defs are translated to exported functions, defps are translated to non-exported functions. Functions return the last expression", "\n    def something() do\n      if 1 == 1 do\n        1\n      else\n        2\n      end\n    end\n\n    defp something_else() do\n    end\n    ", "\n    export function something(){\n      if(1 == 1){\n        return 1;\n      }else{\n        return 2;\n      }\n    }\n\n    function something_else(){\n      return null;\n    }\n    ");
  templates.push(template);

  template = fillTemplate("guards", "guards work on functions and case statements", "\n      def something(one) when is_number(one) do\n      end\n\n      def something(one) when is_number(one) or is_atom(one) do\n      end\n\n      case data do\n        number when number in [1,2,3,4] -> \n          value = 13\n        _  -> \n          true\n      end\n    ", "\n      export function something(one){\n        if(Kernel.is_number(one)){\n          return null;\n        }\n      }\n\n      export function something(one){\n        if(Kernel.or(Kernel.is_number(one), Kernel.is_atom(one))){\n          return null;\n        }\n      }\n\n      (function(){\n        if(Kernel._in(number, [1, 2, 3, 4])){\n          let value = 13;\n          return value;\n        }else{\n          return true;\n        }\n      }());\n    ");
  templates.push(template);

  template = fillTemplate("pattern matching", "pattern matching work on functions and case statements", "\n      def something(1) do\n      end\n\n      def something([apple | fruits]) do\n      end\n\n      def something(%AStruct{key: value, key1: 2}) do\n      end\n\n      case data do\n        %AStruct{key: %BStruct{ key2: value }} -> \n          Logger.info(value)\n        :error -> \n          nil\n      end\n    ", "\n      export function something(_ref0){\n        if(Kernel.match(1, arguments[0])){\n          return null;\n        }\n      }\n\n      export function something(_ref0){\n        if(Kernel.is_list(arguments[0])){\n          let apple = Kernel.hd(arguments[0]);\n          let fruits = Kernel.tl(arguments[0]);\n          return null;\n        }\n      }\n\n      export function something(_ref0){\n        if(Kernel.match({'__struct__': [Atom('AStruct')], 'key': undefined, 'key1': 2}, arguments[0])){\n          let value = arguments[0]['key'];\n          return null;\n        }\n      }\n\n     (function () {\n         if (Kernel.match({ \n              '__struct__': [Atom('AStruct')], \n              'key': { \n                '__struct__': [Atom('BStruct')], \n                'key2': undefined \n              } \n            }, data)) {\n              let value = data['key']['key2'];\n              return Logger.info(value);\n         } else if (Kernel.match(Atom('error'), data)) {\n             return null;\n         }\n     }());\n    ");
  templates.push(template);

  template = fillTemplate("defmodule", "defmodules are treated as es6 modules", "\n    defmodule Hello do\n    end\n    ", "\n    const __MODULE__ = [Atom('Hello')];\n    ");
  templates.push(template);

  template = fillTemplate("imports, aliases, and requires", "imports, aliases, and requires are turned into import statements", "\n    defmodule Hello do\n      import World\n      import US, only: [la: 1]\n      alias Super.Man\n      alias Super.Man as Kent\n      require JQuery\n\n    end\n    ", "\n    const __MODULE__ = [Atom('Hello')];\n\n    import * as World from 'world'\n    import la from 'us'\n    import * as Man from 'super/man'\n    import * as Kent from 'super/man'\n    import JQuery from 'jquery'\n    ");
  templates.push(template);

  template = fillTemplate("structs", "Structs are tranlated into ES6 classes", "\n    defmodule User do\n      defstruct name: \"john\", age: 27\n    end\n\n    defmodule User do\n      defstruct :name, :age\n    end\n\n    user = %User{name: \"Steven\"}\n    ", "\n    const __MODULE__ = [Atom('User')];\n\n    export defstruct(name='John', age=27){\n      return {__struct__: __MODULE__, name: name, age: age};\n    }\n\n\n    const __MODULE__ = [Atom('User')];\n\n    export defstruct(name, age){\n      return {__struct__: __MODULE__, name: name, age: age};\n    }\n\n    let user = User.default(name='Steven');\n    ");
  templates.push(template);

  template = fillTemplate("anonymous functions", "Anonymous functions are translated into JS anonymous functions", "\n    fn(x) -> x * 2 end\n    ", "\n    function(x){\n      return x * 2;\n    }\n    ");
  templates.push(template);

  template = fillTemplate("if statements", "if statements are translated into JS if statements", "\n      if 1 == 1 do\n        a = 1\n      else\n        a = 2\n      end\n    ", "\n    if(1 == 1){\n      let a = 1;\n    }else{\n      let a = 2;\n    }\n    ");
  templates.push(template);

  template = fillTemplate("function calls", "", "\n    something()\n    something_else(1, 2)\n    SomeModule.execute()\n    ", "\n    something();\n    something_else(1, 2);\n    SomeModule.execute();\n    ");
  templates.push(template);

  template = fillTemplate("cond", "Works for simple binary clauses. No pattern matching support yet", "\n      cond do\n        1 + 1 == 1 ->\n          a = 1\n          \"This will never match\"\n        2 * 2 != 4 ->\n          a = 2\n          \"Nor this\"\n        true ->\n          a = 3\n          \"This will\"\n      end\n    ", "\n    (function(){\n      if(1 + 1 == 1){\n        let a = 1;\n        return 'This will never match';\n      }else if(2 * 2 != 4){\n        let a = 2;\n        return 'Nor this';\n      }else{\n        let a = 3;\n        return 'This will';\n      }\n    }());\n    ");
  templates.push(template);

  template = fillTemplate("case", "Works for simple binary clauses. No pattern matching support yet", "\n    case data do\n      false -> value = 13\n      _  -> true\n    end\n    ", "\n      (function(){\n        if(Kernel.match(false, data)){\n          let value = 13;\n          return value;\n        }else{\n          return true;\n        }\n      }());  \n    ");
  templates.push(template);

  template = fillTemplate("for", "Works for one of more generators and with filters. Does support keyword list matching or into yet", "\n    for n <- [1, 2, 3, 4], do: n * 2\n\n    \n\n\n\n\n\n\n\n    for x <- [1, 2], y <- [2, 3], do: x*y\n\n    \n\n\n\n\n\n\n\n\n    for n <- [1, 2, 3, 4, 5, 6], rem(n, 2) == 0, do: n\n    ", "\n      (function(){\n        let _results = [];\n\n        for(let n of [1,2,3,4])\n          _results.push(n * 2);\n        \n        return _results;\n      });\n\n\n      (function(){\n        let _results = [];\n\n        for(let x of [1,2])\n          for(let y of [2,3])\n            _results.push(x * y);\n          \n        return _results;\n      });\n\n\n      (function(){\n        let _results = [];\n\n        for(let n of [1, 2, 3, 4, 5, 6])\n          if(rem(n, 2) == 0)\n            _results.push(n);\n\n        return _results;\n      });      \n    ");
  templates.push(template);

  template = fillTemplate("^", "", "\n    {^a, _, c} = {1, 2, 3}\n    ", "\n    let _ref = Tuple(1, 2, 3);\n\n    if(!Kernel.match(a, _ref[0]))\n      throw new MatchError('no match of right hand side value');\n\n    let undefined = _ref[1];\n    let c = _ref[2];\n      });      \n    ");
  templates.push(template);

  template = fillTemplate("&", "", "\n    fun = &(&1 * 2)\n    ", "\n     let fun = function () {\n         return arguments[0] * 2;\n     };      \n    ");
  templates.push(template);

  template = fillTemplate("bitstring", "", "\n    <<1, 2, 3>>\n    <<1, \"foo\" :: utf8, \"bar\" :: utf32>>\n    ", "\n    BitString(BitString.integer(1), BitString.integer(2), BitString.integer(3))\n    BitString(BitString.integer(1), BitString.utf8('foo'), BitString.utf32('bar'))    \n    ");
  templates.push(template);

  var templates_string = templates.join("");
  container.innerHTML = container.innerHTML + templates_string;
  hljs.initHighlighting();
}
//# sourceMappingURL=app.js.map