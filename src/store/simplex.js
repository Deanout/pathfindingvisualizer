import { observable, computed, action } from "mobx";

export class Simplex {
  @observable threshold = new Threshold();
  @observable seed = new Seed();
  @observable scale = new Scale();
  @observable octave = new Octave();
  @observable persistence = new Persistence();
  @observable lacunarity = new Lacunarity();
  @observable fields = [
    this.threshold,
    this.seed,
    this.scale,
    this.octave,
    this.persistence,
    this.lacunarity
  ];

  @action resetValues() {
    for (let i = 0; i < this.fields.length; i++) {
      this.fields[i].value = this.fields[i].default;
    }
  }

  @action setValueByName(name, value) {
    for (let i = 0; i < this.fields.length; i++) {
      if (this.fields[i].name == name) {
        this.fields[i].value = value;
      }
    }
  }
}

class Threshold {
  @observable name = "Threshold";
  @observable value = 0.5;
  @observable min = 0;
  @observable max = 1;
  @observable step = 0.01;
  @observable default = 0.5;
}

class Seed {
  @observable name = "Seed";
  @observable value = 1337;
  @observable min = 0;
  @observable max = 1000000;
  @observable step = 1;
  @observable default = 1337;
}

class Scale {
  @observable name = "Scale";
  @observable value = 10;
  @observable min = 1;
  @observable max = 100;
  @observable step = 1;
  @observable default = 10;
}

class Octave {
  @observable name = "Octave";
  @observable value = 2;
  @observable min = 1;
  @observable max = 10;
  @observable step = 1;
  @observable default = 2;
}

class Persistence {
  @observable name = "Persistence";
  @observable value = 0.5;
  @observable min = 0;
  @observable max = 1;
  @observable step = 0.01;
  @observable default = 0.5;
}

class Lacunarity {
  @observable name = "Lacunarity";
  @observable value = 2;
  @observable min = 0;
  @observable max = 10;
  @observable step = 1;
  @observable default = 2;
}
