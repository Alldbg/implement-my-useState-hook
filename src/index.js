// ------------------- Version1: $useState1  simple usage of closure to save state-------------------
const $useState1 = (initVal) => {
  let var_ = initVal;

  const setState = (newState) => {
    var_ = newState;
  };

  const getState = () => {
    return var_;
  };

  return [getState, setState];
};

let [foo, setFoo] = $useState1(1);

console.log("$useState1=>   " + foo());
setFoo(2);
console.log("$useState1=>   " + foo());

function Counter() {
  const [count, setCount] = $useState1(0); // same useState as above
  return {
    click: () => setCount(count() + 1),
    render: () => console.log("render:", { count: count() })
  };
}
const C = Counter();
C.render(); // render: { count: 0 }
C.click();
C.render(); // render: { count: 1 }

// ------------------- Version2: $useState2  use state as variable not a function , -------------------

const MyReact = (function () {
  let _val;
  return {
    render(Comp) {
      let C = Comp();
      return C;
    },
    $useState2(initialValue) {
      _val = _val || initialValue;
      function setState(newVal) {
        _val = newVal;
      }
      return [_val, setState];
    }
  };
})();

let [goo, setGoo] = MyReact.$useState2(1);

function Counter2() {
  const [count, setCount] = MyReact.$useState2(0);
  return {
    click: () => setCount(count + 1),
    render: () => console.log("render:", { count })
  };
}

let App;
App = MyReact.render(Counter2); // render: { count: 0 }
App.click();
App = MyReact.render(Counter2); // render: { count: 1 }

// ------------------- Version3: $useState3 , add useEffect -------------------

const MyReact3 = (function () {
  let _val, _deps;
  return {
    render(Component) {
      const Comp = Component();
      Comp.render();
      return Comp;
    },
    $useState3(initialValue) {
      _val = _val || initialValue;
      function setState(newVal) {
        _val = newVal;
      }
      return [_val, setState];
    },
    useEffect(callback, depArray) {
      const hasNoDeps = !depArray;
      const hasChangedDeps = _deps
        ? !depArray.every((el, i) => el === _deps[i])
        : true;
      if (hasNoDeps || hasChangedDeps) {
        callback();
        _deps = depArray;
      }
    }
  };
})();

function Counter3() {
  const [count, setCount] = MyReact3.$useState3(0);

  MyReact3.useEffect(() => {
    console.log("effect", count);
  }, [count]);

  return {
    click: () => setCount(count + 1),
    noop: () => setCount(count),
    render: () => console.log("render", { count })
  };
}

let App3 = MyReact.render(Counter3);
// effect 0
// render {count: 0}
App3.click();
App3 = MyReact.render(Counter3);
// effect 1
// render {count: 1}
App3.noop();
App3 = MyReact.render(Counter3);
// // no effect run
// render {count: 1}
App3.click();
App3 = MyReact.render(Counter3);
// effect 2
// render {count: 2}
