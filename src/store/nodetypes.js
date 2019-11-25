import { observable, computed } from "mobx";

export class NodeTypes {
  @observable list = [];
  constructor() {
    this.list.push(this.nodeType);
    this.list.push(this.air);
    this.list.push(this.wall);
    this.list.push(this.start);
    this.list.push(this.finish);
    this.list.push(this.granite);
    this.list.push(this.grass);
    this.list.push(this.sand);
    this.list.push(this.snow);
    this.list.push(this.stone);
    this.list.push(this.water);
    this.list.push(this.waterDeep);
  }
  @observable nodeType = new NodeType(
    "Node Type",
    0,
    1,
    Infinity,
    "node-wall",
    false,
    [12, 53, 71]
  );
  @observable air = new NodeType("Air", 0, 1, 1, "", true, [255, 255, 255]);
  @observable wall = new NodeType("Wall", 0, 1, Infinity, "node-wall", false, [
    12,
    53,
    71
  ]);
  @observable start = new NodeType("Start", 0, 1, 1, "node-start", true, [
    0,
    150,
    5
  ]);
  @observable finish = new NodeType("Finish", 0, 1, 1, "node-finish", true, [
    150,
    0,
    5
  ]);

  @observable grass = new NodeType("Grass", 0.4, 0.7, 10, "node-grass", true, [
    85,
    125,
    70
  ]);

  @observable sand = new NodeType("Sand", 0.35, 0.4, 15, "node-sand", true, [
    195,
    175,
    125
  ]);
  @observable stone = new NodeType("Stone", 0.7, 0.8, 100, "node-stone", true, [
    175,
    175,
    175
  ]);

  @observable granite = new NodeType(
    "Granite",
    0.8,
    0.9,
    250,
    "node-granite",
    true,
    [140, 140, 140]
  );
  @observable water = new NodeType(
    "Water",
    0.25,
    0.35,
    100,
    "node-water",
    true,
    [0, 110, 255]
  );

  @observable waterDeep = new NodeType(
    "Water Deep",
    0,
    0.25,
    250,
    "node-water-deep",
    true,
    [0, 65, 150]
  );
  @observable snow = new NodeType("snow", 0.9, 1, 150, "node-snow", true, [
    200,
    215,
    225
  ]);
}

class NodeType {
  constructor(
    _name,
    _minThreshold,
    _maxThreshold,
    _weight,
    _class,
    _walkable,
    _rgb
  ) {
    this.name = _name;
    this.minThreshold = _minThreshold;
    this.maxThreshold = _maxThreshold;
    this.weight = _weight;
    this.class = _class;
    this.walkable = _walkable;
    this.rgb = _rgb;
  }
  @observable name = "NamelessNode";
  @observable minThreshold = 0;
  @observable maxThreshold = 1;
  @observable weight = 1;
  @observable class = "";
  @observable walkable = true;
  @observable rgb = [0, 0, 0];
}
