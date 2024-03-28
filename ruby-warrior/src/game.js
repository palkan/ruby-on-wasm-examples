class OutputPrinter {
  constructor(el) {
    this.el = el;
    this.marked = false;
  }

  mark() {
    this.el.innerText = "";
    this.marked = true;
  }

  unmark() {
    this.marked = false;
  }

  print(val) {
    if (this.marked) {
      this.el.innerText += val;
    } else {
      console.log(val);
    }
  }

  puts(val) {
    if (this.marked) {
      this.el.innerText += val;
      this.el.innerText += "\n";
    } else {
      console.log(val);
    }
  }
}

class Game {
  constructor(vm, name, skillLevel) {
    this.vm = vm;
    this.name = name;
    this.skillLevel = skillLevel;
  }

  async start() {
    await this.vm.evalAsync(`
      RubyWarrior::Runner.new(%w[-d /game], StdinStub.new(%w[y ${this.skillLevel} ${this.name}]), STDOUT).run
    `);

    const output = this.vm.$output.flush();

    // find the path to the game directory from the output
    const match = output.match(/See the (.+)\/README for instructions/);
    if (!match) {
      throw new Error("Failed to find game directory path");
    }

    this.gameDir = `/game/${match[1]}`;
  }

  get readme() {
    return this.vm.eval(`File.read("${this.gameDir}/README")`);
  }

  get playerrb() {
    return this.vm.eval(`File.read("${this.gameDir}/player.rb")`);
  }

  async play(input, output) {
    window.$stdout = new OutputPrinter(output);

    let res = await this.vm.evalAsync(`
      File.write("${this.gameDir}/player.rb", <<~'SRC'
${input}
      SRC
      )
      RubyWarrior::Runner.new(%w[-d ${this.gameDir} --max-turns 10], StdinStub.new(%w[y y]), ExternalStdout.new).run
    `);

    return res;
  }
}

export const start = async (vm, name, skillLevel) => {
  const game = new Game(vm, name, skillLevel);
  await game.start();
  return game;
};
