import * as monaco from "monaco-editor";

const DEFAULT_CODE = `# player.rb
class Player
  def play_turn(warrior)
    # add your code here
  end
end

`;

export const init = (target, opts) => {
  return monaco.editor.create(target, {
    value: DEFAULT_CODE,
    language: "ruby",
    automaticLayout: true,
    minimap: {
      enabled: false,
    },
    ...opts,
  });
};
