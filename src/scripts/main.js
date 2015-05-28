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

  hljs.initHighlighting();
}
