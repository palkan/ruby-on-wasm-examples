# Coltrane on Wasm

[Coltrane][] is a music theory library and CLI. Let's turn it into a Wasm module to run in the browser!

## Instructions

```sh
# install deps
bundle install

# IMPORTANT: remove bigdecimal from the Gemfile.lock manually — it's not compiling :(

# build a WASI-compatible Ruby module
bundle exec rbwasm build -o ruby.wasm
```

Now, you can test the compiled `ruby.wasm` using [wasmtime][]:

```sh
wasmtime run ruby.wasm -r/bundle/setup -e "$(cat test.rb)"
```

### Building for Web

Run the following command to build a Wasm module with JS _bindings_:

```sh
JS=true bundle exec rbwasm build -o ruby-web.wasm
```

[Coltrane]: https://github.com/pedrozath/coltrane
[wasmtime]: https://wasmtime.dev
[wasi-preset-args]: https://github.com/kateinoigakukun/wasi-preset-args
