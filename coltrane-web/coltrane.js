import { DefaultRubyVM } from "@ruby/wasm-wasi/dist/browser";

// const APP_URL =
//   'https://vladem.s3.us-west-1.amazonaws.com/rails-on-wasm/coltrane-web.wasm';

const APP_URL = "/ruby-web.wasm";

let coltrane;

export const init = async () => {
  if (coltrane) {
    return coltrane;
  }

  const module = await WebAssembly.compileStreaming(fetch(APP_URL));

  const { vm } = await DefaultRubyVM(module);

  vm.eval(`
    require "/bundle/setup"

    if RUBY_PLATFORM =~ /wasm/
      RbConfig::CONFIG['host_os'] = 'linux'
    end
  
    require "coltrane/ui"
    Paint.mode = 0
  `);

  coltrane = vm;

  return coltrane;
};

export const invoke = async (chord = "Cm7", representation = "Ukulele") => {
  const vm = await init();

  return vm.eval(`
  Coltrane::Commands::Render.run(
    Coltrane::UI::Views::ShowChord.new(chord: '${chord}', chord_representation: '${representation}').render
  )`);
};
