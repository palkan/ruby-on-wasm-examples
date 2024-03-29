import { DefaultRubyVM } from "@ruby/wasm-wasi/dist/browser";

const APP_URL = "/anycable-demo.wasm";

export const init = async () => {
  const module = await WebAssembly.compileStreaming(fetch(APP_URL));

  const { vm } = await DefaultRubyVM(module);

  vm.eval(`
    require "/bundle/setup"

    require "js"

    ENV["RAILS_ENV"] = "production"
    ENV["ACTIVE_RECORD_ADAPTER"] = "sqlite3_wasm"
    ENV["SECRET_KEY_BASE"] = "secret"
    ENV["RAILS_SERVE_STATIC_FILES"] = "true"

    ENV["ANYCABLE_HTTP_BROADCAST_URL"] = "https://stackblitz-demo-yzxy.fly.dev/_broadcast"
    ENV["ANYCABLE_WEBSOCKET_URL"] = "wss://stackblitz-demo-yzxy.fly.dev/cable"

    puts "Initializing Rails application..."

    require "/rails/lib/anycable_rails_demo"

    # Patch AnyCable broadcast adapter to use fetch
    class SocketError < StandardError; end
    module OpenSSL
      module SSL
        class SSLError < SocketError; end
      end
    end
    require "anycable/broadcast_adapters/http"
    AnyCable::BroadcastAdapters::Http.prepend(Module.new do
      def raw_broadcast(...)
        JS.global[:anycableFetch].perform(url, ...)
      end
    end)

    puts "Rails application #{Rails.application.class.name.sub("::Application", "")} (#{Rails::VERSION::STRING}) has been initialized"
  `);

  return vm;
};
