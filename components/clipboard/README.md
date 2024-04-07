# Clipboard

## Introducción
Añadir el script `clipboard.js` a tu documento HTML.

```html
<script src="clipboard.js" type="text/javascript"></script>
```

## Clipboard para código
```html
<section class="w-75 m-auto mt-3">
    <div class="snipet border rounded">
        <div class="snipet-head row align-items-center p-3 border-bottom m-auto">
            <h5 class="col-11">HTML</h5>
            <button type="button" class="btn col-1" clip-toogle="#exampleCode">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard2" viewBox="0 0 16 16">
                  <path d="M3.5 2a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-12a.5.5 0 0 0-.5-.5H12a.5.5 0 0 1 0-1h.5A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1H4a.5.5 0 0 1 0 1z"/>
                  <path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5"/>
                </svg>
            </button>
        </div>
        <div class="snipet-code p-3">
            <pre>
                <code id="exampleCode">
                    &lt;h1 class="section-100"&gt;
                    &lt;/section&gt;
                </code>
            </pre>
        </div>
    </div>
</section>
```

## Clipboard para texto
```html
<section class="w-75 m-auto mt-3">
    <div class="snipet border rounded">
        <div class="snipet-head row align-items-center p-3 border-bottom m-auto">
            <h5 class="col-11">HTML</h5>
            <button type="button" class="btn col-1" clip-toogle="#exampleText">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard2" viewBox="0 0 16 16">
                  <path d="M3.5 2a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-12a.5.5 0 0 0-.5-.5H12a.5.5 0 0 1 0-1h.5A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1H4a.5.5 0 0 1 0 1z"/>
                  <path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5"/>
                </svg>
            </button>
        </div>
        <div class="snipet-code p-3" id="exampleText" style="color: #e24242;">
            Hola, que tal?
        </div>
    </div>
</section>
```