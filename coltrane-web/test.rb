if RUBY_PLATFORM =~ /wasm/
  RbConfig::CONFIG['host_os'] = 'linux'
end

require "coltrane/ui"
Paint.mode = 0

puts Coltrane::Commands::Render.run(
  Coltrane::UI::Views::ShowChord.new(chord: 'Fm7', chord_representation: 'Ukulele').render
)
