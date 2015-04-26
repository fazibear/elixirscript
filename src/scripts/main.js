function fillTemplate(title, description, elixir_code, js_code){
  let template = `<div class="translation">
        <div class="translation-description">
          <h4>${title}</h4>
          <p>${description}</p>
        </div>
        <div class="row translation-code">
          <div class="col-md-6">
            <h5>Elixir</h5> 
            <pre>
              <code class="elixir">
                ${elixir_code}
              </code>
            </pre>        
          </div>
          <div class="col-md-6">
            <h5>JavaScript</h5> 
            <pre>
              <code class="javascript">
                ${js_code}
              </code>
            </pre>        
          </div>
        </div>
      </div>
      <hr/>`;

      console.log(template);
     return template;
}

function main(){
  let container = document.getElementsByClassName('container')[0];
  let templates = [];

  let template = fillTemplate(
    "primatives", 
    "Here is how primatives are translated..", 
    `
    nil
    1
    -1.0
    "Hello"
    "Hello #{length([])}"
    :atom
    [1,2,3]
    {1,2,3}`,
    `
    null
    1
    -1.0
    'Hello'
    'Hello ' + Kernel.to_string(Kernel.length([]))
    Atom('atom')
    [1,2,3]
    Tuple(1, 2, 3)`
  );
  templates.push(template);

  template = fillTemplate(
    "Assignment Patterns", 
    "Assignment patterns are translated into assignment statements.", 
    `
    a = 1

    {a,b} = {1,2}
    
    {^a, _, c} = {1, 2, 3}
    `,
    `
    let a = 1;

    let _ref = Tuple(1, 2);
    let a = _ref[0];
    let b = _ref[1];

    let _ref = Tuple(1, 2, 3);

    if(!Kernel.match(a, _ref[0]))
      throw new MatchError('no match of right hand side value');

    let undefined = _ref[1];
    let c = _ref[2];
    `
  );
  templates.push(template);

  template = fillTemplate(
    "def and defp", 
    "defs are translated to exported functions, defps are translated to non-exported functions. Functions return the last expression", 
    `
    def something() do
      if 1 == 1 do
        1
      else
        2
      end
    end

    defp something_else() do
    end
    `,
    `
    export function something(){
      if(1 == 1){
        return 1;
      }else{
        return 2;
      }
    }

    function something_else(){
      return null;
    }
    `
  );
  templates.push(template);

  template = fillTemplate(
    "guards", 
    "guards work on functions and case statements", 
    `
      def something(one) when is_number(one) do
      end

      def something(one) when is_number(one) or is_atom(one) do
      end

      case data do
        number when number in [1,2,3,4] -> 
          value = 13
        _  -> 
          true
      end
    `,
    `
      export function something(one){
        if(Kernel.is_number(one)){
          return null;
        }
      }

      export function something(one){
        if(Kernel.or(Kernel.is_number(one), Kernel.is_atom(one))){
          return null;
        }
      }

      (function(){
        if(Kernel._in(number, [1, 2, 3, 4])){
          let value = 13;
          return value;
        }else{
          return true;
        }
      }());
    `
  );
  templates.push(template);

  template = fillTemplate(
    "pattern matching", 
    "pattern matching work on functions and case statements", 
    `
      def something(1) do
      end

      def something([apple | fruits]) do
      end

      def something(%AStruct{key: value, key1: 2}) do
      end

      case data do
        %AStruct{key: %BStruct{ key2: value }} -> 
          Logger.info(value)
        :error -> 
          nil
      end
    `,
    `
      export function something(_ref0){
        if(Kernel.match(1, arguments[0])){
          return null;
        }
      }

      export function something(_ref0){
        if(Kernel.is_list(arguments[0])){
          let apple = Kernel.hd(arguments[0]);
          let fruits = Kernel.tl(arguments[0]);
          return null;
        }
      }

      export function something(_ref0){
        if(Kernel.match({'__struct__': [Atom('AStruct')], 'key': undefined, 'key1': 2}, arguments[0])){
          let value = arguments[0]['key'];
          return null;
        }
      }

     (function () {
         if (Kernel.match({ 
              '__struct__': [Atom('AStruct')], 
              'key': { 
                '__struct__': [Atom('BStruct')], 
                'key2': undefined 
              } 
            }, data)) {
              let value = data['key']['key2'];
              return Logger.info(value);
         } else if (Kernel.match(Atom('error'), data)) {
             return null;
         }
     }());
    `
  );
  templates.push(template);

  template = fillTemplate(
    "defmodule", 
    "defmodules are treated as es6 modules", 
    `
    defmodule Hello do
    end
    `,
    `
    const __MODULE__ = [Atom('Hello')];
    `
  );
  templates.push(template);

  template = fillTemplate(
    "imports, aliases, and requires", 
    "imports, aliases, and requires are turned into import statements", 
    `
    defmodule Hello do
      import World
      import US, only: [la: 1]
      alias Super.Man
      alias Super.Man as Kent
      require JQuery

    end
    `,
    `
    const __MODULE__ = [Atom('Hello')];

    import * as World from 'world'
    import la from 'us'
    import * as Man from 'super/man'
    import * as Kent from 'super/man'
    import JQuery from 'jquery'
    `
  );
  templates.push(template);

  template = fillTemplate(
    "structs", 
    "Structs are tranlated into ES6 classes", 
    `
    defmodule User do
      defstruct name: "john", age: 27
    end

    defmodule User do
      defstruct :name, :age
    end

    user = %User{name: "Steven"}
    `,
    `
    const __MODULE__ = [Atom('User')];

    export defstruct(name='John', age=27){
      return {__struct__: __MODULE__, name: name, age: age};
    }


    const __MODULE__ = [Atom('User')];

    export defstruct(name, age){
      return {__struct__: __MODULE__, name: name, age: age};
    }

    let user = User.default(name='Steven');
    `
  );
  templates.push(template);

  template = fillTemplate(
    "anonymous functions", 
    "Anonymous functions are translated into JS anonymous functions", 
    `
    fn(x) -> x * 2 end
    `,
    `
    function(x){
      return x * 2;
    }
    `
  );
  templates.push(template);


  template = fillTemplate(
    "if statements", 
    "if statements are translated into JS if statements", 
    `
      if 1 == 1 do
        a = 1
      else
        a = 2
      end
    `,
    `
    if(1 == 1){
      let a = 1;
    }else{
      let a = 2;
    }
    `
  );
  templates.push(template);

  template = fillTemplate(
    "function calls", 
    "", 
    `
    something()
    something_else(1, 2)
    SomeModule.execute()
    `,
    `
    something();
    something_else(1, 2);
    SomeModule.execute();
    `
  );
  templates.push(template);

  template = fillTemplate(
    "cond", 
    "Works for simple binary clauses. No pattern matching support yet", 
    `
      cond do
        1 + 1 == 1 ->
          a = 1
          "This will never match"
        2 * 2 != 4 ->
          a = 2
          "Nor this"
        true ->
          a = 3
          "This will"
      end
    `,
    `
    (function(){
      if(1 + 1 == 1){
        let a = 1;
        return 'This will never match';
      }else if(2 * 2 != 4){
        let a = 2;
        return 'Nor this';
      }else{
        let a = 3;
        return 'This will';
      }
    }());
    `
  );
  templates.push(template);


  template = fillTemplate(
    "case", 
    "Works for simple binary clauses. No pattern matching support yet", 
    `
    case data do
      false -> value = 13
      _  -> true
    end
    `,
    `
      (function(){
        if(Kernel.match(false, data)){
          let value = 13;
          return value;
        }else{
          return true;
        }
      }());  
    `
  );
  templates.push(template);


  template = fillTemplate(
    "for", 
    "Works for one of more generators and with filters. Does support keyword list matching or into yet", 
    `
    for n <- [1, 2, 3, 4], do: n * 2

    







    for x <- [1, 2], y <- [2, 3], do: x*y

    








    for n <- [1, 2, 3, 4, 5, 6], rem(n, 2) == 0, do: n
    `,
    `
      (function(){
        let _results = [];

        for(let n of [1,2,3,4])
          _results.push(n * 2);
        
        return _results;
      });


      (function(){
        let _results = [];

        for(let x of [1,2])
          for(let y of [2,3])
            _results.push(x * y);
          
        return _results;
      });


      (function(){
        let _results = [];

        for(let n of [1, 2, 3, 4, 5, 6])
          if(rem(n, 2) == 0)
            _results.push(n);

        return _results;
      });      
    `
  );
  templates.push(template);

  template = fillTemplate(
    "&", 
    "", 
    `
    fun = &(&1 * 2)
    `,
    `
     let fun = function () {
         return arguments[0] * 2;
     };      
    `
  );
  templates.push(template);


  template = fillTemplate(
    "bitstring", 
    "", 
    `
    <<1, 2, 3>>
    <<1, "foo" :: utf8, "bar" :: utf32>>
    `,
    `
    BitString(BitString.integer(1), BitString.integer(2), BitString.integer(3))
    BitString(BitString.integer(1), BitString.utf8('foo'), BitString.utf32('bar'))    
    `
  );
  templates.push(template);

  let templates_string = templates.join("");
  container.innerHTML = container.innerHTML + templates_string;
  hljs.initHighlighting();
}