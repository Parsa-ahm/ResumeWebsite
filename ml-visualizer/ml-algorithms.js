/**
 * ML Algorithm Implementations
 * Simplified implementations for visualization purposes
 */

// Sample datasets
const datasets = {
    decisionTree: [
        { age: 25, income: 50000, outcome: 'Approved' },
        { age: 30, income: 60000, outcome: 'Approved' },
        { age: 35, income: 55000, outcome: 'Approved' },
        { age: 40, income: 70000, outcome: 'Approved' },
        { age: 45, income: 80000, outcome: 'Approved' },
        { age: 22, income: 30000, outcome: 'Denied' },
        { age: 28, income: 35000, outcome: 'Denied' },
        { age: 32, income: 40000, outcome: 'Denied' },
        { age: 38, income: 45000, outcome: 'Denied' },
        { age: 50, income: 25000, outcome: 'Denied' }
    ],
    // Real-world loan approval dataset
    loanDataset: [
        { age: 28, income: 65000, creditScore: 720, loanAmount: 250000, approved: 'Yes' },
        { age: 35, income: 85000, creditScore: 780, loanAmount: 350000, approved: 'Yes' },
        { age: 42, income: 120000, creditScore: 810, loanAmount: 500000, approved: 'Yes' },
        { age: 25, income: 45000, creditScore: 680, loanAmount: 200000, approved: 'No' },
        { age: 55, income: 95000, creditScore: 750, loanAmount: 400000, approved: 'Yes' },
        { age: 30, income: 55000, creditScore: 690, loanAmount: 180000, approved: 'No' },
        { age: 38, income: 75000, creditScore: 740, loanAmount: 300000, approved: 'Yes' },
        { age: 22, income: 35000, creditScore: 650, loanAmount: 150000, approved: 'No' },
        { age: 48, income: 110000, creditScore: 790, loanAmount: 450000, approved: 'Yes' },
        { age: 33, income: 60000, creditScore: 710, loanAmount: 220000, approved: 'Yes' },
        { age: 27, income: 40000, creditScore: 670, loanAmount: 160000, approved: 'No' },
        { age: 45, income: 100000, creditScore: 760, loanAmount: 380000, approved: 'Yes' }
    ],
    linearRegression: [
        { x: 1, y: 2.1 },
        { x: 2, y: 3.9 },
        { x: 3, y: 6.2 },
        { x: 4, y: 8.1 },
        { x: 5, y: 9.8 },
        { x: 6, y: 12.2 },
        { x: 7, y: 14.1 },
        { x: 8, y: 16.0 },
        { x: 9, y: 18.2 },
        { x: 10, y: 19.9 }
    ],
    logisticRegression: [
        { x: 0.1, y: 0 },
        { x: 0.2, y: 0 },
        { x: 0.3, y: 0 },
        { x: 0.4, y: 0 },
        { x: 0.5, y: 0 },
        { x: 0.6, y: 1 },
        { x: 0.7, y: 1 },
        { x: 0.8, y: 1 },
        { x: 0.9, y: 1 },
        { x: 1.0, y: 1 }
    ],
    // Real-world datasets for visualization
    housePriceDataset: [
        { size: 1200, bedrooms: 2, age: 5, price: 250000 },
        { size: 1500, bedrooms: 3, age: 3, price: 320000 },
        { size: 1800, bedrooms: 3, age: 8, price: 380000 },
        { size: 2000, bedrooms: 4, age: 2, price: 450000 },
        { size: 2200, bedrooms: 4, age: 10, price: 480000 },
        { size: 2500, bedrooms: 5, age: 1, price: 550000 },
        { size: 1100, bedrooms: 2, age: 15, price: 220000 },
        { size: 1300, bedrooms: 2, age: 12, price: 270000 },
        { size: 1600, bedrooms: 3, age: 6, price: 340000 },
        { size: 1900, bedrooms: 4, age: 4, price: 420000 },
        { size: 2100, bedrooms: 4, age: 7, price: 460000 },
        { size: 2400, bedrooms: 5, age: 5, price: 520000 },
        { size: 1400, bedrooms: 3, age: 9, price: 300000 },
        { size: 1700, bedrooms: 3, age: 11, price: 360000 },
        { size: 2300, bedrooms: 5, age: 6, price: 500000 }
    ],
    emailSpamDataset: [
        { wordCount: 15, links: 0, uppercasePercent: 5, spam: 'No' },
        { wordCount: 25, links: 1, uppercasePercent: 8, spam: 'No' },
        { wordCount: 8, links: 3, uppercasePercent: 45, spam: 'Yes' },
        { wordCount: 30, links: 0, uppercasePercent: 3, spam: 'No' },
        { wordCount: 12, links: 5, uppercasePercent: 60, spam: 'Yes' },
        { wordCount: 20, links: 1, uppercasePercent: 10, spam: 'No' },
        { wordCount: 6, links: 4, uppercasePercent: 70, spam: 'Yes' },
        { wordCount: 35, links: 0, uppercasePercent: 2, spam: 'No' },
        { wordCount: 10, links: 2, uppercasePercent: 35, spam: 'Yes' },
        { wordCount: 28, links: 1, uppercasePercent: 6, spam: 'No' },
        { wordCount: 14, links: 6, uppercasePercent: 55, spam: 'Yes' },
        { wordCount: 22, links: 1, uppercasePercent: 7, spam: 'No' },
        { wordCount: 9, links: 3, uppercasePercent: 40, spam: 'Yes' },
        { wordCount: 32, links: 0, uppercasePercent: 4, spam: 'No' },
        { wordCount: 18, links: 2, uppercasePercent: 25, spam: 'Yes' }
    ],
    customerSegmentationDataset: [
        { annualIncome: 15000, spendingScore: 39, age: 23, cluster: null },
        { annualIncome: 16000, spendingScore: 81, age: 31, cluster: null },
        { annualIncome: 17000, spendingScore: 6, age: 22, cluster: null },
        { annualIncome: 18000, spendingScore: 77, age: 35, cluster: null },
        { annualIncome: 19000, spendingScore: 40, age: 23, cluster: null },
        { annualIncome: 20000, spendingScore: 76, age: 64, cluster: null },
        { annualIncome: 21000, spendingScore: 6, age: 30, cluster: null },
        { annualIncome: 23000, spendingScore: 94, age: 67, cluster: null },
        { annualIncome: 24000, spendingScore: 3, age: 35, cluster: null },
        { annualIncome: 25000, spendingScore: 72, age: 58, cluster: null },
        { annualIncome: 26000, spendingScore: 14, age: 24, cluster: null },
        { annualIncome: 27000, spendingScore: 99, age: 37, cluster: null },
        { annualIncome: 28000, spendingScore: 15, age: 22, cluster: null },
        { annualIncome: 29000, spendingScore: 77, age: 35, cluster: null },
        { annualIncome: 30000, spendingScore: 13, age: 24, cluster: null },
        { annualIncome: 31000, spendingScore: 75, age: 64, cluster: null },
        { annualIncome: 38000, spendingScore: 35, age: 31, cluster: null },
        { annualIncome: 39000, spendingScore: 61, age: 67, cluster: null },
        { annualIncome: 40000, spendingScore: 29, age: 58, cluster: null },
        { annualIncome: 42000, spendingScore: 31, age: 37, cluster: null }
    ]
};

// Custom data points added by users
const customData = {
    decisionTree: [],
    linearRegression: [],
    logisticRegression: []
};

// Linear Regression Implementation
class LinearRegression {
    constructor() {
        this.slope = 0;
        this.intercept = 0;
    }

    train(data) {
        const n = data.length;
        const sumX = data.reduce((sum, p) => sum + p.x, 0);
        const sumY = data.reduce((sum, p) => sum + p.y, 0);
        const sumXY = data.reduce((sum, p) => sum + p.x * p.y, 0);
        const sumXX = data.reduce((sum, p) => sum + p.x * p.x, 0);

        this.slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        this.intercept = (sumY - this.slope * sumX) / n;
    }

    predict(x) {
        return this.slope * x + this.intercept;
    }
}

// Logistic Regression Implementation
class LogisticRegression {
    constructor() {
        this.weights = [0, 0]; // [weight, bias]
        this.learningRate = 0.1;
        this.iterations = 1000;
    }

    sigmoid(z) {
        return 1 / (1 + Math.exp(-z));
    }

    train(data) {
        // Simple gradient descent for logistic regression
        for (let iter = 0; iter < this.iterations; iter++) {
            let gradientW = 0;
            let gradientB = 0;

            for (const point of data) {
                const z = this.weights[0] * point.x + this.weights[1];
                const prediction = this.sigmoid(z);
                const error = prediction - point.y;

                gradientW += error * point.x;
                gradientB += error;
            }

            this.weights[0] -= this.learningRate * gradientW / data.length;
            this.weights[1] -= this.learningRate * gradientB / data.length;
        }
    }

    predict(x) {
        const z = this.weights[0] * x + this.weights[1];
        return this.sigmoid(z);
    }

    getProbability(x) {
        return this.predict(x);
    }
}

// Decision Tree Node
class TreeNode {
    constructor(feature, threshold, left, right, value) {
        this.feature = feature;
        this.threshold = threshold;
        this.left = left;
        this.right = right;
        this.value = value; // For leaf nodes
    }

    isLeaf() {
        return this.value !== null;
    }
}

// Simplified Decision Tree Implementation
class DecisionTree {
    constructor() {
        this.root = null;
    }

    // Simple entropy calculation
    entropy(labels) {
        const counts = {};
        labels.forEach(label => {
            counts[label] = (counts[label] || 0) + 1;
        });

        let entropy = 0;
        const total = labels.length;
        Object.values(counts).forEach(count => {
            const p = count / total;
            entropy -= p * Math.log2(p);
        });

        return entropy;
    }

    // Split data based on feature and threshold
    split(data, feature, threshold) {
        const left = [];
        const right = [];

        data.forEach(point => {
            if (point[feature] <= threshold) {
                left.push(point);
            } else {
                right.push(point);
            }
        });

        return [left, right];
    }

    // Find best split
    findBestSplit(data) {
        let bestGain = -Infinity;
        let bestFeature = null;
        let bestThreshold = null;

        const labels = data.map(p => p.outcome);
        const parentEntropy = this.entropy(labels);

        const features = ['age', 'income'];

        features.forEach(feature => {
            const values = [...new Set(data.map(p => p[feature]))].sort((a, b) => a - b);

            for (let i = 0; i < values.length - 1; i++) {
                const threshold = (values[i] + values[i + 1]) / 2;
                const [left, right] = this.split(data, feature, threshold);

                if (left.length === 0 || right.length === 0) continue;

                const leftLabels = left.map(p => p.outcome);
                const rightLabels = right.map(p => p.outcome);

                const leftEntropy = this.entropy(leftLabels);
                const rightEntropy = this.entropy(rightLabels);

                const weightedEntropy = (left.length / data.length) * leftEntropy +
                    (right.length / data.length) * rightEntropy;

                const gain = parentEntropy - weightedEntropy;

                if (gain > bestGain) {
                    bestGain = gain;
                    bestFeature = feature;
                    bestThreshold = threshold;
                }
            }
        });

        return { feature: bestFeature, threshold: bestThreshold, gain: bestGain };
    }

    // Build tree recursively
    buildTree(data, depth = 0, maxDepth = 3) {
        const labels = data.map(p => p.outcome);
        const uniqueLabels = [...new Set(labels)];

        // Stopping conditions
        if (uniqueLabels.length === 1 || depth >= maxDepth || data.length <= 1) {
            // Return leaf node with majority class
            const counts = {};
            labels.forEach(label => {
                counts[label] = (counts[label] || 0) + 1;
            });
            const majorityLabel = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
            return new TreeNode(null, null, null, null, majorityLabel);
        }

        const split = this.findBestSplit(data);

        if (split.gain <= 0) {
            const counts = {};
            labels.forEach(label => {
                counts[label] = (counts[label] || 0) + 1;
            });
            const majorityLabel = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
            return new TreeNode(null, null, null, null, majorityLabel);
        }

        const [left, right] = this.split(data, split.feature, split.threshold);

        const leftNode = this.buildTree(left, depth + 1, maxDepth);
        const rightNode = this.buildTree(right, depth + 1, maxDepth);

        return new TreeNode(split.feature, split.threshold, leftNode, rightNode, null);
    }

    train(data) {
        this.root = this.buildTree(data);
    }

    predict(point) {
        let node = this.root;

        while (!node.isLeaf()) {
            if (point[node.feature] <= node.threshold) {
                node = node.left;
            } else {
                node = node.right;
            }
        }

        return node.value;
    }

    getPath(point) {
        const path = [];
        let node = this.root;

        while (!node.isLeaf()) {
            const direction = point[node.feature] <= node.threshold ? 'left' : 'right';
            path.push({
                node: node,
                direction: direction,
                condition: `${node.feature} ${direction === 'left' ? '≤' : '>'} ${node.threshold}`
            });

            node = direction === 'left' ? node.left : node.right;
        }

        path.push({
            node: node,
            result: node.value
        });

        return path;
    }
}

// Simple Neural Network Implementation
class SimpleNeuralNetwork {
    constructor() {
        // Simple 2-3-1 network
        this.weights1 = [
            [0.5, 0.3],
            [0.4, 0.2],
            [0.3, 0.1]
        ];
        this.weights2 = [0.6, 0.5, 0.4];
        this.bias1 = [0.1, 0.2, 0.3];
        this.bias2 = 0.1;
    }

    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    forward(inputs) {
        // Hidden layer
        const hidden = [];
        for (let i = 0; i < 3; i++) {
            let sum = this.bias1[i];
            for (let j = 0; j < inputs.length; j++) {
                sum += inputs[j] * this.weights1[i][j];
            }
            hidden.push(this.sigmoid(sum));
        }

        // Output layer
        let output = this.bias2;
        for (let i = 0; i < hidden.length; i++) {
            output += hidden[i] * this.weights2[i];
        }
        output = this.sigmoid(output);

        return {
            inputs: inputs,
            hidden: hidden,
            output: output
        };
    }
}

// Initialize models
const linearRegressionModel = new LinearRegression();
const logisticRegressionModel = new LogisticRegression();
const decisionTreeModel = new DecisionTree();
const neuralNetwork = new SimpleNeuralNetwork();

// Train models on initial datasets
linearRegressionModel.train(datasets.linearRegression);
logisticRegressionModel.train(datasets.logisticRegression);
decisionTreeModel.train(datasets.decisionTree);

// Additional datasets
datasets.kMeans = [
    { x: 1, y: 2 }, { x: 1.5, y: 1.8 }, { x: 2, y: 1.5 },
    { x: 5, y: 8 }, { x: 5.5, y: 9 }, { x: 6, y: 8.5 },
    { x: 9, y: 3 }, { x: 9.5, y: 3.5 }, { x: 10, y: 4 }
];

datasets.knn = [
    { x: 1, y: 2, class: 'A' }, { x: 1.5, y: 2.5, class: 'A' }, { x: 2, y: 3, class: 'A' },
    { x: 5, y: 6, class: 'B' }, { x: 5.5, y: 6.5, class: 'B' }, { x: 6, y: 7, class: 'B' },
    { x: 8, y: 2, class: 'C' }, { x: 8.5, y: 2.5, class: 'C' }, { x: 9, y: 3, class: 'C' }
];

customData.knn = [];

// K-Means Clustering Implementation
class KMeans {
    constructor(k = 3) {
        this.k = k;
        this.centroids = [];
        this.clusters = [];
    }

    initializeCentroids(data) {
        const minX = Math.min(...data.map(p => p.x));
        const maxX = Math.max(...data.map(p => p.x));
        const minY = Math.min(...data.map(p => p.y));
        const maxY = Math.max(...data.map(p => p.y));

        this.centroids = [];
        for (let i = 0; i < this.k; i++) {
            this.centroids.push({
                x: Math.random() * (maxX - minX) + minX,
                y: Math.random() * (maxY - minY) + minY
            });
        }
    }

    euclideanDistance(p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }

    assignClusters(data) {
        this.clusters = Array(this.k).fill().map(() => []);
        data.forEach(point => {
            let minDist = Infinity;
            let clusterIndex = 0;
            this.centroids.forEach((centroid, i) => {
                const dist = this.euclideanDistance(point, centroid);
                if (dist < minDist) {
                    minDist = dist;
                    clusterIndex = i;
                }
            });
            this.clusters[clusterIndex].push(point);
        });
    }

    updateCentroids() {
        let changed = false;
        this.centroids.forEach((centroid, i) => {
            if (this.clusters[i].length === 0) return;
            const newCentroid = {
                x: this.clusters[i].reduce((sum, p) => sum + p.x, 0) / this.clusters[i].length,
                y: this.clusters[i].reduce((sum, p) => sum + p.y, 0) / this.clusters[i].length
            };
            if (this.euclideanDistance(centroid, newCentroid) > 0.01) {
                changed = true;
            }
            this.centroids[i] = newCentroid;
        });
        return changed;
    }

    train(data, k = null) {
        if (k) this.k = k;
        this.initializeCentroids(data);
        let iterations = 0;
        while (iterations < 100) {
            this.assignClusters(data);
            const changed = this.updateCentroids();
            if (!changed) break;
            iterations++;
        }
        return this.clusters;
    }
}

// K-Nearest Neighbors Implementation
class KNN {
    constructor(data) {
        this.data = data;
    }

    euclideanDistance(p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }

    predict(point, k = 3) {
        const distances = this.data.map(d => ({
            point: d,
            distance: this.euclideanDistance(point, d)
        }));

        distances.sort((a, b) => a.distance - b.distance);
        const kNearest = distances.slice(0, k);

        const classCounts = {};
        kNearest.forEach(item => {
            const cls = item.point.class;
            classCounts[cls] = (classCounts[cls] || 0) + 1;
        });

        return Object.keys(classCounts).reduce((a, b) => 
            classCounts[a] > classCounts[b] ? a : b
        );
    }
}

// Simple SVM Implementation (Linear)
class SVM {
    constructor() {
        this.w = [0, 0];
        this.b = 0;
        this.learningRate = 0.01;
        this.iterations = 1000;
    }

    train(data) {
        // Simple gradient descent for linear SVM
        for (let iter = 0; iter < this.iterations; iter++) {
            for (const point of data) {
                const label = point.y === 0 ? -1 : 1;
                const prediction = this.w[0] * point.x + this.w[1] * point.y + this.b;
                
                if (label * prediction < 1) {
                    this.w[0] += this.learningRate * (label * point.x - 2 * 0.01 * this.w[0]);
                    this.w[1] += this.learningRate * (label * point.y - 2 * 0.01 * this.w[1]);
                    this.b += this.learningRate * label;
                } else {
                    this.w[0] -= this.learningRate * 2 * 0.01 * this.w[0];
                    this.w[1] -= this.learningRate * 2 * 0.01 * this.w[1];
                }
            }
        }
    }

    predict(point) {
        const value = this.w[0] * point.x + this.w[1] * point.y + this.b;
        return value > 0 ? 1 : 0;
    }

    getHyperplane(x) {
        return (-this.w[0] * x - this.b) / this.w[1];
    }
}

// NLP Processing Pipeline
class NLPProcessor {
    tokenize(text) {
        return text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    }

    removeStopWords(tokens) {
        const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
        return tokens.filter(token => !stopWords.has(token));
    }

    generateResponse(tokens) {
        // Simple response generation based on keywords
        const responses = {
            'greeting': ['Hello!', 'Hi there!', 'Greetings!'],
            'question': ['That\'s an interesting question.', 'Let me think about that.', 'Good question!'],
            'default': ['I understand.', 'That makes sense.', 'Tell me more.']
        };

        if (tokens.some(t => ['hello', 'hi', 'hey'].includes(t))) {
            return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
        } else if (tokens.some(t => ['what', 'why', 'how', 'when', 'where'].includes(t))) {
            return responses.question[Math.floor(Math.random() * responses.question.length)];
        }
        return responses.default[Math.floor(Math.random() * responses.default.length)];
    }

    process(sentence) {
        const tokens = this.tokenize(sentence);
        const filtered = this.removeStopWords(tokens);
        const response = this.generateResponse(filtered);
        return {
            original: sentence,
            tokens: tokens,
            filtered: filtered,
            response: response
        };
    }
}

// Initialize models
const kMeansModel = new KMeans(3);
const knnModel = new KNN(datasets.knn);
const svmModel = new SVM();
const nlpProcessor = new NLPProcessor();

// Train SVM
svmModel.train(datasets.logisticRegression);
