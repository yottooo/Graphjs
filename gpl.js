/*
 * My Graph Library implementation in JavaScript
 * Yoan Bachev - yobachev@gmail.com
 */


var Base = {
    Graph: function (Dir =0, weighted=0) {


        this.nodes = [];
        this.nodeCounter = 0;
        this.edges = [];
        this.edgesPrim = {};//For Prim
        this.Directed = Dir;//SET Graph TYPE
        this.Weighted = weighted;
        this.adjList = [];//Used for the traversalls
        this.nodeMap = {};//For Prim

    },
    Node: function () {
        var n;
        this.neighbors = [];

    },

    Edge: function (node1, node2, w) {
        this.node1 = node1;
        this.node2 = node2;
        this.w = w;
    },
    Neighborlist: function (Dir=0, weighted=0) {
        this.nodes = [];
        this.nodeCounter = 0;
        this.Directed = Dir;//SET LIST TYPE
        this.Weighted = weighted;
        this.adjList = [];//Used for the traversalls
        this.edgesPrim = {};//For Prim
        this.nodeMap = {};//For Prim

    },

    Neighbor: function (op, w) {
        //Check if the weight is positive
        this.op = op;
        this.w = w;
    }

};
Base.Edge.prototype.other = function (x) {
    return x == this.node1 ? this.node2 : this.node1;
};
/* declare 'Base' namespace */
//Declaring basic add function for Edge list
Base.Graph.prototype.add = function (nod1, nod2, w) {
    if (nod1 != nod2) {
        if (this.Weighted == true) { //Check for weight
            if (w < 1 || w == null || w == undefined) {
                w = "Error not acceptable weight";    //If the weight doesn't fit the criteria set to ERor
            }
        }

        var e = new Base.Edge(nod1, nod2, w);
        //Check if Edge exists
        for (i = 0; i < this.edges.length; i++) {
            if (this.edges[i].node1 === nod1 && this.edges[i].node2 === nod2
                || this.edges[i].node1 === nod2 && this.edges[i].node2 === nod1) {
                e = "";
            }
        }

        //Check if Node exists
        if (!(this.nodes.includes(nod1))) {
            e.node1.n = this.nodeCounter;
            this.nodes.push(e.node1);
            this.nodeMap[nod1.n] = this.nodes.length - 1;
            this.nodeCounter++;
            this.adjList[e.node1.n] = [];
            this.edgesPrim[e.node1.n] = [];
        }

        if (!(this.nodes.includes(nod2))) {
            e.node2.n = this.nodeCounter;
            this.nodes.push(e.node2);
            this.nodeMap[nod2.n] = this.nodes.length - 1;
            this.nodeCounter++;
            this.adjList[e.node2.n] = [];
            this.edgesPrim[e.node2.n] = [];
        }
        this.adjList[nod1.n].push(nod2.n);
        this.adjList[nod2.n].push(nod1.n);
        if (e != "") {
            this.edges.push(e);

            if (w != "") {//for Prim im creating double edges
                this.edgesPrim[e.node1.n].push(new Base.Edge(e.node1.n, e.node2.n, w));
                this.edgesPrim[e.node2.n].push(new Base.Edge(e.node2.n, e.node1.n, w));
            }
        }

    }
};
//DOT PRINT FOR EDGE LIST SUPPORTS DIRECTED AND UNDIRECTED
Base.Graph.prototype.Dot = function () {
    var wflag = this.Weighted;
    var string = "Graph g{\n";
    if (this.Directed == true) {
        con = "->";
    }
    else {
        con = "--"
    }
    this.edges.forEach(function (e) {
        string += e.node1.n;
        string += con;
        string += e.node2.n + " ";

        if (wflag) {   //Check to see if graph is weighted
            string += "[weight='";
            string += e.w;
            string += "']";
        }

        string += "\n";
    });
    string += "}";
    return string;
    //console.log(string);
};
//DFS for edge list-----------------------------------
Base.Graph.prototype.traverseDFS = function (vertex) {
    var visited = [];
    this._traverseDFS(vertex, visited);
};
Base.Graph.prototype._traverseDFS = function (vertex, visited) {
    visited[vertex] = true;
    if (this.adjList[vertex] !== undefined) {
        console.log("Visited: " + vertex);
    }
    for (var i = 0; i < this.adjList[vertex].length; i++) {
        if (!visited[this.adjList[vertex][i]]) {
            this._traverseDFS(this.adjList[vertex][i], visited);
        }
    }
};
//DFS for Neighbor list-----------------------------------
Base.Neighborlist.prototype.traverseDFS = function (vertex) {
    var visited = [];
    this._traverseDFS(vertex, visited);
};
Base.Neighborlist.prototype._traverseDFS = function (vertex, visited) {
    visited[vertex] = true;
    if (this.adjList[vertex] !== undefined) {
        console.log("Visited: " + vertex);
    }
    for (var i = 0; i < this.adjList[vertex].length; i++) {
        if (!visited[this.adjList[vertex][i]]) {
            this._traverseDFS(this.adjList[vertex][i], visited);
        }
    }
};

//BFS--------------------------------------------------------------------
Base.Graph.prototype.traverseBFS = function (vertex) {

    var queue = [];
    queue.push(vertex);
    var visited = [];
    visited[vertex] = true;

    while (queue.length) {
        vertex = queue.shift();
        console.log("Visited: " + vertex);
        for (var i = 0; i < this.adjList[vertex].length; i++) {
            if (!visited[this.adjList[vertex][i]]) {
                visited[this.adjList[vertex][i]] = true;
                queue.push(this.adjList[vertex][i]);
            }
        }
    }
};
//BFS Neighborlist---------------------------------------------------------------
Base.Neighborlist.prototype.traverseBFS = function (vertex) {

    var queue = [];
    queue.push(vertex);
    var visited = [];
    visited[vertex] = true;

    while (queue.length) {
        vertex = queue.shift();
        console.log("Visited: " + vertex);
        for (var i = 0; i < this.adjList[vertex].length; i++) {
            if (!visited[this.adjList[vertex][i]]) {
                visited[this.adjList[vertex][i]] = true;
                queue.push(this.adjList[vertex][i]);
            }
        }
    }
};

//Prim-------------------
function Prim(graph) {
    if (graph.Directed != 0 || graph.Weighted != 1) {
        return "Wrong configuration expecting undirected weighted graph";//Check for valid graph configuration
    }
    var g = graph;
    var result = [];
    var usedNodes = {};
    var mst = [];

    function findMin(g) {
        var min = [999999, null];
        for (var i = 0; i < result.length; i++)
            for (var n = 0; n < g.edgesPrim[result[i]].length; n++)
                if (g.edgesPrim[result[i]][n].w < min[0] && usedNodes[g.edgesPrim[result[i]][n].node2] === undefined) {
                    min = [g.edgesPrim[result[i]][n].w, g.edgesPrim[result[i]][n].node2, g.edgesPrim[result[i]][n].node1];
                    //console.log(min);
                }
        //console.log(min[1]);
        mst.push(min[2] + "---" + min[1]);
        return min[1];

    }

    // Pick starting point
    var node = 4;
    result.push(node);
    usedNodes[node] = true;

    var min = findMin(g);
    while (min != null) {

        result.push(min);
        usedNodes[min] = true;
        min = findMin(g);
    }
    mst.pop();
    console.log("Minimum spaning Tree:" + mst);
    return result;
};
//Dijkstra---------------------------------------
var StackNode = function (value) {
    this.value = value;
    this.next = null;
};


var Stack = function () {
    this.N = 0;
    this.first = null;
};

Stack.prototype.push = function (a) {
    this.first = this._push(this.first, a);
};

Stack.prototype._push = function (x, a) {
    if (x == null) {
        this.N++;
        return new StackNode(a);
    }
    var oldX = x;
    this.N++;
    x = new StackNode(a);
    x.next = oldX;
    return x;
};

Stack.prototype.pop = function () {
    if (this.first == null) {
        return undefined;
    }

    var oldFirst = this.first;
    var item = oldFirst.value;
    this.first = oldFirst.next;
    this.N--;

    return item;
};

Stack.prototype.size = function () {
    return this.N;
};

Stack.prototype.isEmpty = function () {
    return this.N == 0;
};

Stack.prototype.peep = function () {
    if (this.first == null) {
        return undefined;
    }

    return this.first.value;
};

Stack.prototype.toArray = function () {
    var result = [];
    x = this.first;
    while (x != null) {
        result.push(x.value);
        x = x.next;
    }
    return result;
};
var less = function (a1, a2, compare) {
    return compare(a1, a2) < 0;
};

var exchange = function (a, i, j) {
    var temp = a[i];
    a[i] = a[j];
    a[j] = temp;
};

var IndexMinPQ = function (N, compare) {
    this.keys = [];
    this.pq = [];
    this.qp = []; // positions of key in pq
    for (var i = 0; i <= N; ++i) {
        this.keys.push(null);
        this.pq.push(0);
        this.qp.push(-1);
    }
    this.N = 0;

    if (!compare) {
        compare = function (a1, a2) {
            return a1 - a2;
        };
    }
    this.compare = compare;
};

IndexMinPQ.prototype.insert = function (index, key) {
    this.keys[index] = key;

    this.pq[++this.N] = index;
    this.qp[index] = this.N;
    this.swim(this.N);
};

IndexMinPQ.prototype.decreaseKey = function (index, key) {
    if (less(key, this.keys[index], this.compare)) {
        this.keys[index] = key;
        this.swim(this.qp[index]);
    }
};

IndexMinPQ.prototype.minKey = function () {
    return this.keys[this.pq[1]];
};

IndexMinPQ.prototype.min = function () {
    return this.pq[1];
};

IndexMinPQ.prototype.delMin = function () {
    var key = this.pq[1];
    exchange(this.pq, 1, this.N);
    this.qp[this.pq[1]] = 1;

    this.qp[this.pq[this.N]] = -1;
    this.keys[this.pq[this.N]] = null;

    this.N--;

    this.sink(1);

    return key;
};

IndexMinPQ.prototype.swim = function (k) {
    while (k > 1) {
        var parent = Math.floor(k / 2);
        if (less(this.keys[this.pq[k]], this.keys[this.pq[parent]], this.compare)) {
            exchange(this.pq, k, parent);
            this.qp[this.pq[k]] = k;
            this.qp[this.pq[parent]] = parent;
            k = parent;
        } else {
            break;
        }
    }
};

IndexMinPQ.prototype.sink = function (k) {
    while (2 * k <= this.N) {
        var child = k * 2;
        if (child < this.N && less(this.keys[this.pq[child + 1]], this.keys[this.pq[child]], this.compare)) {
            child++;
        }
        if (less(this.keys[this.pq[child]], this.keys[this.pq[k]], this.compare)) {
            exchange(this.pq, k, child);
            this.qp[this.pq[k]] = k;
            this.qp[this.pq[child]] = child;
            k = child;
        } else {
            break;
        }
    }
};

IndexMinPQ.prototype.containsIndex = function (index) {
    return this.qp[index] != -1;
};

IndexMinPQ.prototype.isEmpty = function () {
    return this.N == 0;
};

IndexMinPQ.prototype.size = function () {
    return this.N;
};

var Dijkstra = function (G, s) {
    if (G.Directed != 1 || G.Weighted != 1) {
        return "Wrong configuration expecting undirected weighted graph";//Check for valid graph configuration
    }
    var V = G.edges.length;//initialize a number for the vertexes
    this.s = s;//set a source node
    this.marked = [];
    this.edgeTo = [];
    this.cost = [];
    this.pq = new IndexMinPQ(V, function (cost1, cost2) {//Create priority queu
        return cost1, cost2;
    });

    for (var v = 0; v < V; ++v) {
        this.marked.push(false);
        this.edgeTo.push(null);
        this.cost.push(Number.MAX_VALUE);
    }

    this.cost[s] = 0;

    this.pq.insert(s, this.cost[s]);

    while (!this.pq.isEmpty()) {
        var v = this.pq.delMin();
        this.marked[v] = true;
        var adj_v = G.edgesPrim[v];
        for (var i = 0; i < adj_v.length; ++i) {
            var e = adj_v[i];
            this.relax(e);
        }
    }

};
Dijkstra.prototype.relax = function (e) {

    var v = e.node1;
    var d = e.node2;


    if (this.cost[d] > this.cost[v] + e.w) {
        this.cost[d] = this.cost[v] + e.w;
        this.edgeTo[d] = e;
        if (this.pq.containsIndex(d)) {
            this.pq.decreaseKey(d, this.cost[d]);
        } else {
            this.pq.insert(d, this.cost[d]);
        }
    }
};
Dijkstra.prototype.hasPathTo = function (v) {
    return this.marked[v];
};


Dijkstra.prototype.pathTo = function (v) {
    var path = new Stack();
    for (var x = v; x != this.s; x = this.edgeTo[x].other(x)) {
        path.push(this.edgeTo[x]);
    }
    return path.toArray();
};

Dijkstra.prototype.distanceTo = function (v) {
    return this.cost[v];
};
//Dijkstra--------------------------------------------------
//Declaring the add function for the neighborlist
Base.Neighborlist.prototype.add = function (nod1, nod2, w) {
    if (nod1 != nod2) {
        if (this.Weighted == true) { //Check for weight
            if (w < 1 || w == null || w == undefined) {
                w = "Error not acceptable weight";    //If the weight doesnt fit the criteria set to ERor
            }
        }
        if (!(this.nodes.includes(nod1))) {
            nod1.n = this.nodeCounter;
            this.nodes.push(nod1);
            this.nodeMap[nod1.n] = this.nodes.length - 1;
            this.nodeCounter++;
            this.adjList[nod1.n] = [];
            this.edgesPrim[nod1.n] = [];

        }

        if (!(this.nodes.includes(nod2))) {
            nod2.n = this.nodeCounter;
            this.nodes.push(nod2);
            this.nodeMap[nod2.n] = this.nodes.length - 1;
            this.nodeCounter++;
            this.adjList[nod2.n] = [];
            this.edgesPrim[nod2.n] = [];

        }
        this.adjList[nod1.n].push(nod2.n);
        this.adjList[nod2.n].push(nod1.n);
        nod1.neighbors.push(new Base.Neighbor(nod2.n, w));
        if (w != "") {
            this.edgesPrim[nod1.n].push(new Base.Edge(nod1.n, nod2.n, w));
            this.edgesPrim[nod2.n].push(new Base.Edge(nod2.n, nod1.n, w));
        }
        if (this.Directed == false) { //IFF THE LIST IS DIRECTED NODE IS ONLY CONNECTED TO TARGET
            nod2.neighbors.push(new Base.Neighbor(nod1.n, w));
        }
    }
};
//DOT PRINT FOR NEIGHBORLIST SUPPORTS DIRECTED AND UNDIRECTED
Base.Neighborlist.prototype.Dot = function () {
    var wflag = this.Weighted;

    var string = "Graph g{ \n";
    for (j = 0; j < this.nodes.length; j++) {
        if (this.nodes[j].neighbors[0] != null) { //CHECK TO SEE IF NODE HAS NEIGHBORS FOR THE DIRECTED LIST+
            string += j;
            if (this.Directed == true) {
                string += "->"
            }
            else {
                string += "--"
            }
        }

        this.nodes[j].neighbors.forEach(function (e) {
            string += e.op;
            if (wflag) {
                string += "[weight='" + e.w + "']" + " ";
            }
        });

        if (this.nodes[j].neighbors[0] != null) {
            string += "\n";
        }
    }
    ;
    string += "}";
    console.log(string);
};
/*
 * ---------------%<------------------
 * End of my implementation
 */

Base.Test = Base.Test || {};
/* declare 'Base.Test' namespace */

Base.Test = {
    /* Acceptance tests */
    test1: assertEq(typeof Base.Graph === 'function', true, "Graph class does not exist"),
    test2: assertEq(typeof Base.Edge === 'function', true, "Edge class does not exist"),
    test3: assertEq(typeof Base.Node === 'function', true, "Node class does not exist"),
    test4: assertEq(typeof Base.Graph.prototype.add === 'function', true, "Method 'add' for Graph does not exist")
};
/*
 * Begin of my tests
 * (Pls. only use assertEq(v1, v2[, message]))
 * ---------------%<------------------
 */
//Generate Graph
var G = new Base.Graph(0, 1);
n1 = new Base.Node();
n2 = new Base.Node();
n3 = new Base.Node();
n4 = new Base.Node();
n5 = new Base.Node();
n6 = new Base.Node();
n7 = new Base.Node();
n8 = new Base.Node();//Node initialization
//create undigraph
G.add(n1, n2, 1);
G.add(n1, n3, 4);
G.add(n1, n4, 5);
G.add(n1, n5, 1);
G.add(n5, n6, 10);
G.add(n5, n7, 2);
G.add(n5, n8, 7);
//STEP 1 TEST FOR EXACT NUMBER OF NODES AND EDGES
test6: assertEq(G.edges.length === 7 && G.nodes.length === 8, true, "there has to be 7 Edges AND 8 NODES");	 //#test number of edges AND NODES
//TEST DOT

var str = G.Dot();
console.log(str);
var re = "Graph g{\n0--1 [weight='1']\n0--2 [weight='4']\n0--3 [weight='5']\n0--4 [weight='1']\n4--5 [weight='10']\n4--6 [weight='2']\n4--7 [weight='7']\n}";
test7:assertEq(str == re, true, "Strings must match");
//STEP 2
//Dot print the undirected graph
G.Dot();
//Create digrapgh
var GD = new Base.Neighborlist(1, 1);
GD.add(n1, n2, 1);
GD.add(n2, n3, 4);
GD.add(n2, n4, 5);
GD.add(n2, n6, 1);
GD.add(n5, n6, 10);
GD.add(n6, n7, 2);
GD.add(n6, n8, 7);

//Dot print THE Directed Graph
GD.Dot();
//CONSTRAINT TESTS
var TG = new Base.Graph();
var TN = new Base.Neighborlist();
//CHECK IF NODES CAN CONNECT TO THEMSELFES
TG.add(n1, n1);
test7: assertEq(TG.nodes.length === 0, true, "there has to be  0 NODES");	 //#test if nodes can connect to themselves for Graph
TN.add(n1, n1);
test8: assertEq(TG.nodes.length === 0, true, "there has to be  0 NODES");	 //#test if nodes can connect to themselves for Neigborlist
//CHECK FOR DOUBLE EDGES
TG.add(n1, n2);
TG.add(n1, n2);
TG.add(n2, n1);
test8: assertEq(TG.edges.length === 1, true, "there has to be  1 EDGE");	 //#test if EDGES can connect twice
//CHECK IF NON-WEIGHTED EDGES CAN BE ADDED TO A WEIGHTED GRAPH
var TGW = new Base.Graph(0, 1);//Created undirected weighted graph
TGW.add(n1, n2, 5);
TGW.add(n1, n3);
test9:assertEq(TGW.Dot() === "Graph g{\n0--1 [weight='5']\n0--2 [weight='Error not acceptable weight']\n}", true, "Strings must match");
console.log('----------------------Step3--------------');
G.traverseDFS(4);
console.log('---^^^DFS-edgelist');
GD.traverseDFS(4);
console.log('---^^^DFS-neighborlist');
G.traverseBFS(4);
console.log('---^^BFS');
GD.traverseBFS(4);
console.log('---^^BFS--Neighborlist');
var result = Prim(G);
console.log("Nodes visited in order: " + result);
console.log('---^^Prim should output 4,0,1,6,2,3,7,5 with 4 as a start node');
console.log("----------Dijkstra----------------");
var GDW = new Base.Graph(1, 1);//Initialize directed weigted graph for djikstra
n1 = new Base.Node();
n4 = new Base.Node();
n6 = new Base.Node();
n2 = new Base.Node();
n5 = new Base.Node();
n7 = new Base.Node();
n3 = new Base.Node();
n8 = new Base.Node();
GDW.add(n1, n2, 1);
GDW.add(n1, n3, 4);
GDW.add(n1, n4, 5);
GDW.add(n1, n5, 1);
GDW.add(n5, n6, 10);
GDW.add(n5, n7, 2);
GDW.add(n5, n8, 7);
var dijkstra = new Dijkstra(GDW, 0);
for (var v = 1; v < GDW.edges.length + 1; ++v) {
    if (dijkstra.hasPathTo(v)) {
        var path = dijkstra.pathTo(v);
        console.log('=====path from 0 to ' + v + ' start==========');
        for (var i = 0; i < path.length; ++i) {
            var e = path[i];
            console.log(e.node1 + ' => ' + e.node2 + ': ' + e.w);
        }
        console.log('=====path from 0 to ' + v + ' end==========');
        console.log('=====distance: ' + dijkstra.distanceTo(v) + '=========');
    }
}

/* ---------------%<------------------
 * End of my tests
 */


delete Base.Test;



