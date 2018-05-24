'use strict';
const BinomialHeap = require('./binomial.js');

const heap = new BinomialHeap();
heap.insert(3, 'colibri');
heap.insert(7, 'rabbit');
heap.insert(8, 'rat');
heap.insert(9, 'wolf');

const heap1 = new BinomialHeap();
heap1.insert(1, 'giraffe');
heap1.insert(2, 'hamster');
heap1.insert(11, 'spider');

heap.union(heap1);

console.log(heap.searchKey(7));
console.log(heap.searchKey(11));

heap.decreaseKey(8,  5);
console.log(heap.searchKey(8));
console.log(heap.searchKey(5));

while (!heap.isEmpty()) {
  const node = heap.findMinimum();
  console.log(node.key + ' ' + node.data);
  heap.extractMinimum();
}
