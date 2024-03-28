require "spec_helper"

class Player
  def turn(warrior)
  end
end

describe RubyWarrior::Units::Warrior do
  before(:each) { @warrior = RubyWarrior::Units::Warrior.new }

  it "should default name to warrior" do
    expect(@warrior.name).to eq("Warrior")
    @warrior.name = ""
    expect(@warrior.name).to eq("Warrior")
  end

  it "should be able to set name" do
    @warrior.name = "Joe"
    expect(@warrior.name).to eq("Joe")
    expect(@warrior.to_s).to eq("Joe")
  end

  it "should have 20 max health" do
    expect(@warrior.max_health).to eq(20)
  end

  it "should have 0 score at beginning and be able to earn points" do
    expect(@warrior.score).to be_zero
    @warrior.earn_points(5)
    expect(@warrior.score).to eq(5)
  end

  it "should call player.play_turn and pass turn to player" do
    player = double
    expect(player).to receive(:play_turn).with("turn")
    allow(@warrior).to receive(:player).and_return(player)
    @warrior.play_turn("turn")
  end

  it "should call Player.new the first time loading player, and return same object next time" do
    expect(Player).to receive(:new).and_return("player").once
    2.times { expect(@warrior.player).to eq("player") }
  end

  it "should have an attack power of 5" do
    expect(@warrior.attack_power).to eq(5)
  end

  it "should have an shoot power of 3" do
    expect(@warrior.shoot_power).to eq(3)
  end

  it "should appear as @ on map" do
    expect(@warrior.character).to eq("@")
  end

  it "should be able to add golem abilities which are used on base golem" do
    @warrior.add_golem_abilities :walk!
    expect(@warrior.base_golem.abilities.keys).to eq([:walk!])
  end
end
