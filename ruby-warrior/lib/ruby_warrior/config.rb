module RubyWarrior
  class Config
    class << self
      attr_accessor :delay, :in_stream, :out_stream, :practice_level
      attr_writer :path_prefix, :skip_input, :max_turns

      def path_prefix
        @path_prefix || "."
      end

      def max_turns
        @max_turns || 1000
      end

      def skip_input?
        @skip_input
      end

      def reset
        %i[@path_prefix @skip_input @delay @in_stream @out_stream @practice_level].each do |i|
          remove_instance_variable(i) if instance_variable_defined?(i)
        end
      end
    end
  end
end
