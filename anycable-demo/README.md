# AnyCable Demo on Wasm

Run AnyCable demo application fully in your browser via Wasm!

**NOTE:** Use [this branch](https://github.com/anycable/anycable_rails_demo/tree/spike/wasm) of AnyCable Demo to compile the `anycable-demo.wasm` module.

## Prerequisites

The app relies on a Service Worker to serve requests through the Rails/Wasm app. Service Workers require secure connections, so we recommend using [puma-dev](https://github.com/puma/puma-dev) to deal with this limitation locally.

Install `puma-dev` and add the port 5173 to its configuration:

```sh
echo "5173" > ~/.puma-dev/anywasm
```

## Running locallly

```sh
yarn install

yarn dev --host 0.0.0.0
```

Then go to [https://anywasm.test](https://anywasm.test).

> [!NOTE]
> Use Chrome or another browser supporting [CookieStore API](https://caniuse.com/?search=cookiestore).

## Known issues

The Ruby VM instance sometimes get lost in the worker (idk 🤷‍♂️). Just unregister it manually and restart the app—everything should work.
