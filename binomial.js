'use strict';

function Node(key, data) {
  this.key = key;
  this.data = data;
  this.degree = 0;
  this.parent = null;
  this.child = null;
  this.sibling = null;
}

const BinomialHeap = function() {
  this.head = null;
};

BinomialHeap.prototype.clear = function() {
  this.head = null;
};

BinomialHeap.prototype.isEmpty = function() {
  return !this.head;
};

BinomialHeap.prototype.findMinimum = function() {
  if (!this.head) {
    return null;
  }

  let min = Infinity;

  let current = null;
  let next = this.head;

  while (next) {
    if (next.key < min) {
      min = next.key;
      current = next;
    }
    next = next.sibling;
  }

  return current;
};

function binomialLink(worst, better) {
  worst.parent = better;
  worst.sibling = better.child;
  better.child = worst;
  better.degree++;
}

BinomialHeap.prototype.union = function(h) {
  const heap = new BinomialHeap();
  heap.head = merge(this, h);

  if (!heap.head) {
    return null;
  }

  let previous = null;
  let current = heap.head;
  let next = current.sibling;

  while (next) {
    if (current.degree !== next.degree || (next.sibling && next.sibling.degree === current.degree)) {
      previous = current;
      current = next;
    } else if (current.key <= next.key) {
      current.sibling = next.sibling;
      binomialLink(next, current);
    } else {
      if (!previous) {
        heap.head = next;
      } else {
        previous.sibling = next;
      }
      binomialLink(current, next);
      current = next;
    }
    next = current.sibling;
  }

  this.head = heap.head;
};

function merge(h1, h2) {
  if (!h1.head) {
    return h2.head;
  }
  if (!h2.head) {
    return h1.head;
  }

  const heap = new BinomialHeap();
  let next1 = h1.head;
  let next2 = h2.head;

  if (h1.head.degree <= h2.head.degree) {
    heap.head = h1.head;
    next1 = next1.sibling;
  } else {
    heap.head = h2.head;
    next2 = next2.sibling;
  }

  let tail = heap.head;

  while (next1 && next2) {
    if (next1.degree <= next2.degree) {
      tail.sibling = next1;
      next1 = next1.sibling;
    } else {
      tail.sibling = next2;
      next2 = next2.sibling;
    }
    tail = tail.sibling;
  }

  tail.sibling = next1 || next2;

  return heap.head;
}

BinomialHeap.prototype.insert = function(key, value) {
  const heap = new BinomialHeap();
  const node = new Node(key, value);
  heap.head = node;
  this.union(heap);
};

BinomialHeap.prototype.extractMinimum = function() {
  if (!this.head) {
    return null;
  }

  const min = this.findMinimum();
  let prev = this.head;

  while (prev && prev.sibling !== min) {
    prev = prev.sibling;
  }

  excludeRoot(this, min, prev);
  return min;
};

function excludeRoot(h, root, previous) {
  if (root === h.head) {
    h.head = root.sibling;
  } else {
    previous.sibling = root.sibling;
  }

  let head;
  let child = root.child;

  while (child) {
    const next = child.sibling;
    child.sibling = head;
    child.parent = null;
    head = child;
    child = next;
  }

  const heap = new BinomialHeap();
  heap.head = head;

  h.union(heap);
}

BinomialHeap.prototype.decreaseKey = function(key, newKey) {
  const element = search(this.head, key);

  if (!element) {
    return;
  }
  if (newKey > element.key) {
    return;
  }

  element.key = newKey;
  let current = element;
  let parent = current.parent;

  while (parent && current.key < parent.key) {
    const tempKey = current.key;
    current.key = parent.key;
    parent.key = tempKey;

    const tempData = current.data;
    current.data = parent.data;
    parent.key = tempData;

    current = parent;
    parent = parent.parent;
  }
};

BinomialHeap.prototype.searchKey = function(key) {
  return search(this.head, key);
};

function search(current, key) {
  let result = null;

  if (current.key === key)
    return current;

  if (current.child && !result)
    result = search(current.child, key);
  if (current.sibling && !result)
    result = search(current.sibling, key);

  return result;
}

module.exports = BinomialHeap;
