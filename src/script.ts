const angle_range: HTMLInputElement = document.querySelector("input");
const labelSize = 20;
const initialHeight = 50;
const initialPosition = 100;
var treeHeight: number = 0;
var initialAngle: number = 20;
var tiltedHeight: number =
  initialHeight * Math.cos((Math.PI / 180) * initialAngle);
var tiltedWidth: number =
  initialHeight * Math.sin((Math.PI / 180) * initialAngle);

type nodetype = {
  value: number;
  parent: number;
  left: number;
  right: number;
  color: string;
  root: boolean;
  index: number;
};

type coloredNode = {
  value: number;
  color: string;
};

var nodes: Array<number> = [];
var timers: Array<number> = [];
function sleep(ms: number) {
  return new Promise((resolve: TimerHandler) => setTimeout(resolve, ms));
}
var updating: boolean = false;

var treeArray: Array<nodetype> = [];

var rootT: nodetype = null;

function node(value: number): nodetype {
  return {
    value,
    parent: null,
    left: null,
    right: null,
    color: "r",
    root: false,
    index: -1,
  };
}

function printTree(root: number) {
  treenodes = [];
  var nodes: {} = { 1: root };
  var level: number = 0;

  while (true) {
    var temp = {};
    treenodes.push({});
    var done = true;
    for (var i = 1; i <= 2 ** level; i++) {
      if (!treeArray[nodes[i]]) {
        continue;
      }
      done = false;
      treenodes[level][i] = {
        value: treeArray[nodes[i]].value,
        color: treeArray[nodes[i]].color,
      };
      temp[i * 2 - 1] = treeArray[nodes[i]].left;
      temp[i * 2] = treeArray[nodes[i]].right;
    }

    if (done) {
      treenodes.pop();
      treenodes = treenodes.reverse();
      return;
    }
    nodes = temp;
    level++;
  }
}

function insert(value: number, root: number): number {
  if (!treeArray[root]) {
    let n: nodetype = node(value);
    treeArray.push(n);
    n.index = treeArray.length - 1;
    n.root = true;
    n.color = "b";
    return n.index;
  }
  if (value > treeArray[root].value) {
    if (treeArray[root].right != null) {
      return insert(value, treeArray[root].right);
    } else {
      var n = node(value);
      treeArray.push(n);
      n.index = treeArray.length - 1;
      treeArray[root].right = n.index;
      n.parent = root;
      return n.index;
    }
  } else {
    if (treeArray[root].left != null) {
      return insert(value, treeArray[root].left);
    } else {
      var n = node(value);
      treeArray.push(n);
      n.index = treeArray.length - 1;
      treeArray[root].left = n.index;
      n.parent = root;
      return n.index;
    }
  }
}

function turnBlack(z: number): number {
  if (treeArray[z].left != null) {
    treeArray[treeArray[z].left].color = "b";
  }
  if (treeArray[z].right != null) {
    treeArray[treeArray[z].right].color = "b";
  }
  if (!treeArray[z].root) {
    treeArray[z].color = "r";
    return restructureTree(z);
  }
  return z;
}

function setRootParent(z: number, parent: number, child: number): number {
  if (!parent) {
    treeArray[z].root = false;
    treeArray[child].root = true;
    treeArray[child].parent = null;
    return;
  }
  if (treeArray[z].value > treeArray[parent].value) {
    treeArray[parent].right = child;
  } else {
    treeArray[parent].left = child;
  }
  treeArray[child].parent = parent;
}

function setParent(parent: number, branch: string, child: number) {
  treeArray[parent][branch] = child;
  if (!(child == null)) {
    treeArray[child].parent = parent;
  }
}

function restructureTree(x: number): number {
  var root: number = x;

  const y: number = treeArray[x]?.parent;
  const z: number = treeArray[y]?.parent;
  const parent: number = treeArray[z]?.parent;

  if (y == null || y == undefined || z == null || z == undefined) {
    return root;
  }

  if (treeArray[y].color != "r") {
    return root;
  }

  const zLeftColor =
    treeArray[z].left == null ? "b" : treeArray[treeArray[z].left].color;
  const zRightColor =
    treeArray[z].right == null ? "b" : treeArray[treeArray[z].right].color;

  if (treeArray[y].value > treeArray[z].value) {
    if (zLeftColor == "b") {
      if (treeArray[x].value >= treeArray[y].value) {
        treeArray[z].color = "r";
        treeArray[x].color = "r";
        treeArray[y].color = "b";
        // treeArray[z].right = treeArray[y].left;
        setParent(z, "right", treeArray[y].left);
        // treeArray[y].left = z;
        setParent(y, "left", z);
        setRootParent(z, parent, y);
        root = y;
      } else {
        treeArray[x].color = "b";
        treeArray[z].color = "r";
        treeArray[y].color = "r";
        // treeArray[z].right = treeArray[x].left;
        setParent(z, "right", treeArray[x].left);
        // treeArray[y].left = treeArray[x].right;
        setParent(y, "left", treeArray[x].right);
        // treeArray[x].left = z;
        setParent(x, "left", z);
        // treeArray[x].right = y;
        setParent(x, "right", y);
        setRootParent(z, parent, x);
        root = x;
      }
    } else {
      root = turnBlack(z);
    }
  } else {
    if (zRightColor == "b") {
      if (treeArray[y].value >= treeArray[x].value) {
        treeArray[z].color = "r";
        treeArray[x].color = "r";
        treeArray[y].color = "b";
        // treeArray[z].left = treeArray[y].right;
        setParent(z, "left", treeArray[y].right);
        // treeArray[y].right = z;
        setParent(y, "right", z);
        setRootParent(z, parent, y);
        root = y;
      } else {
        treeArray[x].color = "b";
        treeArray[z].color = "r";
        treeArray[y].color = "r";
        // treeArray[z].left = treeArray[x].right;
        setParent(z, "left", treeArray[x].right);
        // treeArray[y].right = treeArray[x].left;
        setParent(y, "right", treeArray[x].left);
        // treeArray[x].left = y;
        setParent(x, "left", y);
        // treeArray[x].right = z;
        setParent(x, "right", z);
        setRootParent(z, parent, x);
        root = x;
      }
    } else {
      root = turnBlack(z);
    }
  }
  return root;
}

function add(value: number, root: number) {
  let addedNode: number = insert(value, root);
  let newRoot: number = restructureTree(addedNode);
  console.log(treeArray[newRoot].color);
  if (treeArray[newRoot].root) {
    rootT = treeArray[newRoot];
  }
}

function main() {
  rootT = null;
  add(10, rootT?.index);
  add(7, rootT?.index);
  add(42, rootT?.index);
  add(31, rootT?.index);
  add(64, rootT?.index);
  add(29, rootT?.index);
  add(83, rootT?.index);
  add(50, rootT?.index);
  add(5, rootT?.index);
  add(23, rootT?.index);
  add(89, rootT?.index);
  printTree(rootT?.index);
}

function buildTree() {
  rootT = null;
  treeArray = [];
  nodes.forEach((x) => {
    console.log(x);
    add(x, rootT?.index);
  });
}

angle_range.addEventListener("input", (e) => {
  initialAngle = parseInt((<HTMLInputElement>e.target).value);
  rebuild();
});

let treenodes: Array<{ [name: number]: coloredNode }> = [];

var card_id = 1;
function addCard() {
  var card = document.createElement("div");
  card.className = "node";
  var input = document.createElement("input");
  input.type = "number";
  input.className = "num";
  input.id = card_id.toString();
  card_id++;
  card.appendChild(input);
  document.querySelector(".add_card").before(card);
  input.addEventListener("input", (e) => {
    receiveInput(<HTMLInputElement>e.target);
  });
}
var inputs: { [name: string]: number } = {};

function receiveInput(e: HTMLInputElement) {
  if (e.value == "") {
    return;
  }
  if (parseInt(e.value) < 0) {
    e.value = "0";
    return;
  }
  inputs[e.id] = parseInt(e.value);
  nodes = [];
  for (let i in inputs) {
    nodes.push(inputs[i]);
  }
  buildTree();
  printTree(rootT?.index);
  console.log(treeArray[1]?.color, treeArray[1]?.value);
  build();
}

function build() {
  if (updating) {
    return;
  }
  updating = true;
  treeHeight = treenodes.length - 1;
  var parent = document.querySelector(".box");
  timers.forEach((x) => clearTimeout(x));
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
  if (treenodes.length > 0) {
    addLabel(
      treenodes[treeHeight][1].value,
      treeHeight,
      1,
      0,
      initialPosition - labelSize / 2,
      1
    );
  }

  if (treeHeight <= 0) {
    updating = false;
    return;
  }

  var length = Math.sqrt((tiltedWidth * 2) ** 2 + tiltedHeight ** 2);
  var angle = (Math.acos(tiltedHeight / length) * 180) / Math.PI;

  for (var i = -1; i < 2; i += 2) {
    addLine(
      0,
      0,
      initialAngle,
      initialHeight,
      i,
      2 - (i + 1) / 2,
      treeHeight - 1
    );
  }
  for (var j = -1; j < 2; j += 2) {
    buildLevelOne(treeHeight, j);

    for (var i = 3; i < treeHeight; i++) {
      buildLevelThree(treeHeight, i, j);
    }
    for (var k = treeHeight - 1; k > 1; k--) {
      for (var i = 0; i < 2; i++) {
        addLine(
          -tiltedWidth,
          (k - 1) * tiltedHeight,
          i == 0 ? 0 : angle,
          i == 0 ? tiltedHeight : length,
          j,
          (j == -1 ? 1 + i : 0 - i) + 2 ** (treeHeight - (treeHeight - k + 1)),
          treeHeight - k
        );
      }
    }
  }
  updating = false;
}

function rebuild() {
  if (updating) {
    return;
  }
  updating = true;
  treeHeight = treenodes.length - 1;

  timers.forEach((x) => clearTimeout(x));
  tiltedHeight = initialHeight * Math.cos((Math.PI / 180) * initialAngle);
  tiltedWidth = initialHeight * Math.sin((Math.PI / 180) * initialAngle);
  var length = Math.sqrt((tiltedWidth * 2) ** 2 + tiltedHeight ** 2);
  var angle = (Math.acos(tiltedHeight / length) * 180) / Math.PI;

  for (var i = -1; i < 2; i += 2) {
    updateLine(
      0,
      0,
      initialAngle,
      initialHeight,
      i,
      2 - (i + 1) / 2,
      treeHeight - 1
    );
  }
  for (var j = -1; j < 2; j += 2) {
    rebuildLevelOne(treeHeight, j);

    for (var i = 3; i < treeHeight; i++) {
      rebuildLevelThree(treeHeight, i, j);
    }
    for (var k = treeHeight - 1; k > 1; k--) {
      for (var i = 0; i < 2; i++) {
        updateLine(
          -tiltedWidth,
          (k - 1) * tiltedHeight,
          i == 0 ? 0 : angle,
          i == 0 ? tiltedHeight : length,
          j,
          (j == -1 ? 1 + i : 0 - i) + 2 ** (treeHeight - (treeHeight - k + 1)),
          treeHeight - k
        );
      }
    }
  }
  updating = false;
}
main();
build();

function rebuildLevelThree(treeHeight, level, direction) {
  var k = 2 ** (treeHeight - level + 2) / 2 + (direction == -1 ? 3 : -2);
  for (var j = 0; j < 2 ** (treeHeight - level) - 1; j++) {
    for (var i = 1; i <= 2; i++) {
      var width = 2 ** (level - 2) * i * tiltedWidth;
      var length = Math.sqrt(tiltedHeight ** 2 + width ** 2);
      var angle = (Math.acos(tiltedHeight / length) * 180) / Math.PI;
      updateLine(
        -tiltedWidth * 3 - j * 2 ** (level - 1) * tiltedWidth,
        (treeHeight - (level - 1)) * tiltedHeight,
        angle,
        length,
        direction,
        k,
        level - 2
      );
      k -= direction;
    }
  }
}

function buildLevelThree(treeHeight, level, direction) {
  var k = 2 ** (treeHeight - level + 2) / 2 + (direction == -1 ? 3 : -2);
  for (var j = 0; j < 2 ** (treeHeight - level) - 1; j++) {
    for (var i = 1; i <= 2; i++) {
      var width = 2 ** (level - 2) * i * tiltedWidth;
      var length = Math.sqrt(tiltedHeight ** 2 + width ** 2);
      var angle = (Math.acos(tiltedHeight / length) * 180) / Math.PI;

      var l = addLine(
        -tiltedWidth * 3 - j * 2 ** (level - 1) * tiltedWidth,
        (treeHeight - (level - 1)) * tiltedHeight,
        angle,
        length,
        direction,
        k,
        level - 2
      );
      k -= direction;
    }
  }
}

function rebuildLevelOne(treeHeight, direction) {
  var treeWidthL = 2 ** treeHeight / 4;
  if (treeHeight < 2) {
    return;
  }
  var k = direction == 1 ? 2 ** treeHeight / 2 : 2 ** treeHeight / 2 + 1;
  for (var i = 0; i < treeWidthL; i++) {
    for (var j = 0; j < 2; j++) {
      var x = i * (-tiltedWidth * 2) - tiltedWidth;
      var y = (treeHeight - 1) * tiltedHeight;
      var angle = j == 1 ? initialAngle : -initialAngle;
      updateLine(x, y, angle, initialHeight, direction, k, 0);
      k += direction * -1;
    }
  }
}

function buildLevelOne(treeHeight, direction) {
  var treeWidthL = 2 ** treeHeight / 4;
  if (treeHeight < 2) {
    return;
  }
  var k = direction == 1 ? 2 ** treeHeight / 2 : 2 ** treeHeight / 2 + 1;
  for (var i = 0; i < treeWidthL; i++) {
    for (var j = 0; j < 2; j++) {
      var x = i * (-tiltedWidth * 2) - tiltedWidth;
      var y = (treeHeight - 1) * tiltedHeight;
      var angle = j == 1 ? initialAngle : -initialAngle;
      addLine(x, y, angle, initialHeight, direction, k, 0);
      k += direction * -1;
    }
  }
}

function addLine(
  x: number,
  y: number,
  angle: number,
  height: number,
  direction: number,
  id = -1,
  level: number
) {
  if (treenodes[level]?.[id] == undefined) {
    return;
  }
  var parent = document.querySelector(".box");
  var line = document.createElement("div");
  line.className = "line";
  line.style.transform = `translate(${0}px, ${
    y + initialPosition
  }px) rotateZ(${0}deg)`;
  line.id = `l${level}${id}`;
  parent.appendChild(line);
  if (level == treeHeight - 1) {
    line.style.zIndex = "1";
  }
  if (level == 0 && treeHeight > 1) {
    var newAngle =
      (Math.asin(
        ((tiltedWidth - labelSize / 2) * (angle < 0 ? -1 : 1)) / height
      ) *
        180) /
      Math.PI;
    newAngle = angle - newAngle;
    angle -= newAngle;
  }

  timers.push(
    setTimeout(() => {
      line.style.height = `${height}px`;
      line.style.transform = `translate(${0}px, ${
        y + initialPosition
      }px) rotateZ(${0}deg)`;
    }, 100)
  );
  timers.push(
    setTimeout(() => {
      line.style.transform = `translate(${x * direction}px, ${
        y + initialPosition
      }px) rotateZ(${angle * direction}deg)`;
    }, 600)
  );
  timers.push(
    setTimeout(() => {
      addLabel(treenodes[level]?.[id].value, level, id, angle, 0, direction);
    }, 1100)
  );
  return line;
}

function addLabel(
  text: string | number,
  level: number,
  id: number,
  angle: number,
  y: number,
  direction: number
) {
  var parent = document.getElementById(`l${level}${id}`);
  if (!parent) {
    parent = document.querySelector(".box");
  }
  var label = document.createElement("div");
  label.className = "label";

  label.style.transform = `translate(${0}px, ${y + labelSize / 2}px) rotateZ(${
    angle * -1 * direction
  }deg)`;
  if (treenodes[level][id].color == "r") {
    label.style.backgroundColor = "red";
  }
  label.id = `b${level}${id}`;
  label.innerHTML = text.toString();
  parent.appendChild(label);
  setTimeout(() => {
    label.style.height = `${labelSize}px`;
    label.style.width = `${labelSize}px`;
  }, 100);
}

function updateLine(
  x: number,
  y: number,
  angle: number,
  height: number,
  direction: number,
  id: number,
  level: number
) {
  var line = document.getElementById(`l${level}${id}`);
  if (!line) {
    return;
  }
  if (level == 0 && treeHeight > 1) {
    var newAngle =
      (Math.asin(
        ((tiltedWidth - labelSize / 2) * (angle < 0 ? -1 : 1)) / height
      ) *
        180) /
      Math.PI;
    newAngle = angle - newAngle;
    angle -= newAngle;
  }
  line.style.height = `${height}px`;
  line.style.transform = `translate(${x * direction}px, ${
    y + initialPosition
  }px) rotateZ(${angle * direction}deg)`;

  updateLabel(`b${level}${id}`, angle, direction);
}

function updateLabel(id: string, angle: number, direction: number) {
  var label = document.getElementById(id);
  label.style.transform = `translate(${0}px, ${labelSize / 2}px) rotateZ(${
    angle * -1 * direction
  }deg)`;
  // label.style.height = `${0}px`;
  // label.style.width = `${0}px`;

  // setTimeout(() => {
  //   label.style.height = `${labelSize}px`;
  //   label.style.width = `${labelSize}px`;
  // }, 500);
}
