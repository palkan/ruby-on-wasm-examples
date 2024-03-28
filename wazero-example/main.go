package main

import (
	"bytes"
	"context"
	"fmt"
	"log/slog"
	"os"
	"time"

	"github.com/tetratelabs/wazero"
	"github.com/tetratelabs/wazero/imports/wasi_snapshot_preview1"
)

func main() {
	ctx, _ := context.WithTimeout(context.Background(), 15*time.Second)

	logLevel := slog.LevelInfo

	if os.Getenv("DEBUG") == "1" {
		logLevel = slog.LevelDebug
	}

	slog.SetDefault(slog.New(slog.NewTextHandler(
		os.Stdout, &slog.HandlerOptions{Level: logLevel})))

	// Initialize Wazero runtime
	slog.Debug("Initializing Wazero runtime")
	cache, err := wazero.NewCompilationCacheWithDir("./.wazero-cache")
	if err != nil {
		slog.Error("Failed to create compilation cache", "err", err)
		os.Exit(1)
	}

	rconfig := wazero.NewRuntimeConfig().WithCompilationCache(cache)
	runtime := wazero.NewRuntimeWithConfig(ctx, rconfig)

	wasmpath := os.Getenv("WASM_PATH")
	if wasmpath == "" {
		wasmpath = "../ruby.wasm"
	}

	// Read the ruby.wasm file
	slog.Debug("Reading Wasm...", "path", wasmpath)
	wasmBytes, err := os.ReadFile(wasmpath)
	if err != nil {
		slog.Error("Failed to read wasm file", "err", err)
		os.Exit(1)
	}
	slog.Debug("Read Wasm module", "path", wasmpath, "size", len(wasmBytes))

	// Compile the module
	slog.Debug("Compiling Ruby Wasm module...")
	module, err := runtime.CompileModule(ctx, wasmBytes)
	if err != nil {
		slog.Error("Failed to compile module", "err", err)
		os.Exit(1)
	}

	rubyCode := os.Getenv("RUBY_CODE")

	if rubyCode == "" {
		rubyCode = "puts %Q{Hello, World from #{RUBY_VERSION} #{RUBY_PLATFORM}}"
	}

	stdin := bytes.NewBufferString(fmt.Sprintf("%s\n", rubyCode))
	stdout := bytes.NewBuffer(nil)
	stderr := bytes.NewBuffer(nil)

	config := wazero.NewModuleConfig().
		WithStdout(stdout).
		WithStderr(stderr).
		WithStdin(stdin)

	// Instantiate WASI, which implements system I/O such as console output.
	wasi_snapshot_preview1.MustInstantiate(ctx, runtime)

	// Instantiate the module
	slog.Debug("Instantiating Ruby Wasm module...")
	instance, err := runtime.InstantiateModule(ctx, module, config.WithArgs("ruby", "-ne", "eval($_)"))
	if err != nil {
		slog.Error("Failed to instantiate module", "err", err, "stderr", stderr.String())
		os.Exit(1)
	}
	slog.Debug("Instantiated Ruby Wasm module")

	rubyErr := stderr.String()
	if rubyErr != "" {
		slog.Error("Ruby error", "error", rubyErr)
		os.Exit(1)
	}

	output := stdout.String()
	fmt.Print(output)

	exports := module.ExportedFunctions()
	for name, def := range exports {
		slog.Debug("exported function", "name", name, "params", def.ParamNames())
	}

	// Don't forget to close the instance and runtime when done
	defer instance.Close(ctx)
	defer runtime.Close(ctx)
}
