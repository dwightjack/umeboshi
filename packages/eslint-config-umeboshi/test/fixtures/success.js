const next = (value) => value + 1;

class Counter {

    num = 0

    static mult = 2

    get value() {
        return this.num * Counter.mult;
    }

    next() {
        this.num = next(this.num);
    }

}

const counter = new Counter();

for (let i = 0; i < 10; i += 1) {
    counter.next();
}

export default counter;