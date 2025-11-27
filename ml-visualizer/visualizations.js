/**
 * Visualization Rendering Functions
 */

let linearRegressionChart = null;
let logisticRegressionChart = null;
let kMeansChart = null;
let knnChart = null;
let svmChart = null;

// Initialize all visualizations when page loads
function initializeVisualizations() {
    renderDecisionTree();
    renderLinearRegression();
    renderLogisticRegression();
    renderNeuralNetwork();
    // New algorithms will be rendered when tabs are clicked
}

// Decision Tree Visualization
function renderDecisionTree() {
    const svg = d3.select('#decision-tree-svg');
    svg.selectAll('*').remove();

    const width = svg.node().getBoundingClientRect().width || 800;
    const height = 600;
    svg.attr('width', width).attr('height', height);

    // Simple tree structure for visualization (simplified example)
    const treeData = {
        name: "Income ≤ 45000?",
        children: [
            {
                name: "Age ≤ 30?",
                children: [
                    { name: "Denied", value: "Denied" },
                    { name: "Denied", value: "Denied" }
                ]
            },
            {
                name: "Income ≤ 65000?",
                children: [
                    { name: "Approved", value: "Approved" },
                    {
                        name: "Age > 35?",
                        children: [
                            { name: "Approved", value: "Approved" },
                            { name: "Approved", value: "Approved" }
                        ]
                    }
                ]
            }
        ]
    };

    try {
        const treeLayout = d3.tree().size([height - 150, width - 200]);
        const root = d3.hierarchy(treeData);
        treeLayout(root);

        const g = svg.append('g').attr('transform', 'translate(100, 50)');

        // Draw links
        g.selectAll('.link')
            .data(root.links())
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('d', d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x))
            .attr('fill', 'none')
            .attr('stroke', 'rgba(255, 255, 255, 0.3)')
            .attr('stroke-width', 2);

        // Draw nodes
        const nodes = g.selectAll('.node')
            .data(root.descendants())
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.y},${d.x})`);

        nodes.append('rect')
            .attr('class', 'decision-tree-node')
            .attr('x', -70)
            .attr('y', -15)
            .attr('width', 140)
            .attr('height', 30)
            .attr('rx', 5)
            .on('click', function(event, d) {
                d3.selectAll('.decision-tree-node').classed('selected', false);
                d3.select(this).classed('selected', true);
            });

        nodes.append('text')
            .attr('class', 'decision-tree-text')
            .attr('dy', 5)
            .text(d => {
                const text = d.data.name || '';
                return text.length > 18 ? text.substring(0, 18) + '...' : text;
            })
            .style('font-size', '11px')
            .style('fill', 'white');
    } catch (e) {
        console.error('Error rendering tree:', e);
        // Fallback simple visualization
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height / 2)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .text('Decision Tree Visualization');
    }

    // Add data points visualization
    const dataPointsContainer = svg.append('g').attr('transform', 'translate(0, 550)');
    
    datasets.decisionTree.forEach((point, i) => {
        dataPointsContainer.append('circle')
            .attr('class', 'data-point')
            .attr('cx', (i % 10) * (width / 10) + 50)
            .attr('cy', 0)
            .attr('r', 6)
            .attr('fill', point.outcome === 'Approved' ? '#4ade80' : '#ef4444')
            .attr('data-index', i)
            .on('click', function() {
                highlightDecisionTreePath(point);
            })
            .append('title')
            .text(`Age: ${point.age}, Income: ${point.income}`);
    });

    // Add custom points
    customData.decisionTree.forEach((point, i) => {
        dataPointsContainer.append('circle')
            .attr('class', 'data-point custom-data-point')
            .attr('cx', (i % 10) * (width / 10) + 50)
            .attr('cy', -30)
            .attr('r', 6)
            .attr('fill', '#ff6b6b')
            .on('click', function() {
                highlightDecisionTreePath(point);
            })
            .append('title')
            .text(`Custom - Age: ${point.age}, Income: ${point.income}`);
    });
}

function highlightDecisionTreePath(point) {
    // This function is now handled by animations.js
    // Keeping for backward compatibility
    logDecisionTreeProcess(point);
    animateDecisionTreePath(point);
}

// Linear Regression Visualization
function renderLinearRegression() {
    const ctx = document.getElementById('linear-regression-chart');
    if (!ctx) return;

    const allData = [...datasets.linearRegression, ...customData.linearRegression];

    if (linearRegressionChart) {
        linearRegressionChart.destroy();
    }

    // Generate regression line points
    const minX = Math.min(...allData.map(p => p.x));
    const maxX = Math.max(...allData.map(p => p.x));
    const regressionLine = [];
    for (let x = minX - 1; x <= maxX + 1; x += 0.1) {
        regressionLine.push({
            x: x,
            y: linearRegressionModel.predict(x)
        });
    }

    linearRegressionChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Training Data',
                    data: datasets.linearRegression,
                    backgroundColor: 'rgba(74, 222, 128, 0.6)',
                    borderColor: 'rgba(74, 222, 128, 1)',
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'Custom Data',
                    data: customData.linearRegression,
                    backgroundColor: 'rgba(255, 107, 107, 0.6)',
                    borderColor: 'rgba(255, 107, 107, 1)',
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'Regression Line',
                    data: regressionLine,
                    type: 'line',
                    backgroundColor: 'rgba(74, 144, 226, 0.3)',
                    borderColor: 'rgba(74, 144, 226, 1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false,
                    tension: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.datasetIndex === 2) {
                                return `Predicted: ${context.parsed.y.toFixed(2)}`;
                            }
                            return `(${context.parsed.x}, ${context.parsed.y})`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    title: {
                        display: true,
                        text: 'X Value',
                        color: 'white'
                    }
                },
                y: {
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    title: {
                        display: true,
                        text: 'Y Value',
                        color: 'white'
                    }
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const element = elements[0];
                    const dataset = linearRegressionChart.data.datasets[element.datasetIndex];
                    const point = dataset.data[element.index];
                    if (dataset.label !== 'Regression Line') {
                        // Clear console and log the process
                        clearConsole();
                        logToConsole('=== Linear Regression: Point Analysis ===', 'info');
                        showLinearRegressionPrediction(point);
                    }
                }
            },
            onHover: (event, elements) => {
                event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
            }
        }
    });
}

function showLinearRegressionPrediction(point) {
    // This function is now handled by animations.js
    logLinearRegressionProcess(point);
    animateLinearRegressionPoint(point);
}

// Logistic Regression Visualization
function renderLogisticRegression() {
    const ctx = document.getElementById('logistic-regression-chart');
    if (!ctx) return;

    const allData = [...datasets.logisticRegression, ...customData.logisticRegression];

    if (logisticRegressionChart) {
        logisticRegressionChart.destroy();
    }

    // Generate sigmoid curve
    const sigmoidCurve = [];
    for (let x = 0; x <= 1; x += 0.01) {
        sigmoidCurve.push({
            x: x,
            y: logisticRegressionModel.predict(x)
        });
    }

    logisticRegressionChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Class 0',
                    data: allData.filter(p => p.y === 0),
                    backgroundColor: 'rgba(239, 68, 68, 0.6)',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'Class 1',
                    data: allData.filter(p => p.y === 1),
                    backgroundColor: 'rgba(74, 222, 128, 0.6)',
                    borderColor: 'rgba(74, 222, 128, 1)',
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'Sigmoid Curve',
                    data: sigmoidCurve,
                    type: 'line',
                    backgroundColor: 'rgba(74, 144, 226, 0.3)',
                    borderColor: 'rgba(74, 144, 226, 1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.datasetIndex === 2) {
                                const prob = context.parsed.y;
                                return `Probability: ${prob.toFixed(3)} (${(prob > 0.5 ? 'Class 1' : 'Class 0')})`;
                            }
                            return `(${context.parsed.x.toFixed(2)}, ${context.parsed.y})`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    min: 0,
                    max: 1,
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    title: {
                        display: true,
                        text: 'Feature Value',
                        color: 'white'
                    }
                },
                y: {
                    min: -0.1,
                    max: 1.1,
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    title: {
                        display: true,
                        text: 'Probability / Class',
                        color: 'white'
                    }
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const element = elements[0];
                    const dataset = logisticRegressionChart.data.datasets[element.datasetIndex];
                    const point = dataset.data[element.index];
                    if (dataset.label !== 'Sigmoid Curve') {
                        clearConsole();
                        logToConsole('=== Logistic Regression: Probability Analysis ===', 'info');
                        logToConsole(`[Step 1] Clicked point: (${point.x.toFixed(2)}, ${point.y})`, 'info');
                        setTimeout(() => {
                            const probability = logisticRegressionModel.getProbability(point.x);
                            const prediction = probability > 0.5 ? 1 : 0;
                            logToConsole(`[Step 2] Calculating probability using sigmoid function...`, 'info');
                            setTimeout(() => {
                                logToConsole(`[Step 3] Probability: ${probability.toFixed(3)}`, 'success');
                                logToConsole(`[Step 4] Prediction: Class ${prediction} (${probability > 0.5 ? 'Yes' : 'No'})`, 'success');
                                showLogisticRegressionProbability(point);
                            }, 500);
                        }, 500);
                    }
                }
            },
            onHover: (event, elements) => {
                event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
            }
        }
    });
}

function showLogisticRegressionProbability(point) {
    const probability = logisticRegressionModel.getProbability(point.x);
    const prediction = probability > 0.5 ? 1 : 0;
    
    // Visual highlight on the chart
    if (logisticRegressionChart) {
        const datasetIndex = point.y === 0 ? 0 : 1;
        const pointIndex = logisticRegressionChart.data.datasets[datasetIndex].data.findIndex(
            p => Math.abs(p.x - point.x) < 0.01 && p.y === point.y
        );
        
        if (pointIndex !== -1) {
            const meta = logisticRegressionChart.getDatasetMeta(datasetIndex);
            if (meta.data[pointIndex]) {
                meta.data[pointIndex]._model.radius = 10;
                meta.data[pointIndex]._model.borderWidth = 3;
                logisticRegressionChart.update('active');
                
                // Reset after delay
                setTimeout(() => {
                    meta.data[pointIndex]._model.radius = 6;
                    meta.data[pointIndex]._model.borderWidth = 1;
                    logisticRegressionChart.update('active');
                }, 2000);
            }
        }
    }
}

// Neural Network Visualization
function renderNeuralNetwork() {
    const svg = d3.select('#nn-svg');
    svg.selectAll('*').remove();

    const width = 800;
    const height = 500;
    const layerSpacing = 200;
    const neuronSpacing = 80;
    const layers = [2, 3, 1]; // Input, Hidden, Output
    const layerYPositions = [150, 300, 450];

    // Draw connections
    // Input to Hidden
    for (let i = 0; i < layers[0]; i++) {
        for (let j = 0; j < layers[1]; j++) {
            const x1 = layerYPositions[0];
            const y1 = height / 2 - (layers[0] - 1) * neuronSpacing / 2 + i * neuronSpacing;
            const x2 = layerYPositions[1];
            const y2 = height / 2 - (layers[1] - 1) * neuronSpacing / 2 + j * neuronSpacing;

            svg.append('line')
                .attr('class', 'nn-connection')
                .attr('id', `conn-${i}-${j}`)
                .attr('x1', x1 + 25)
                .attr('y1', y1)
                .attr('x2', x2 - 25)
                .attr('y2', y2)
                .attr('stroke', 'rgba(255, 255, 255, 0.2)')
                .attr('stroke-width', 2);
        }
    }

    // Hidden to Output
    for (let i = 0; i < layers[1]; i++) {
        const x1 = layerYPositions[1];
        const y1 = height / 2 - (layers[1] - 1) * neuronSpacing / 2 + i * neuronSpacing;
        const x2 = layerYPositions[2];
        const y2 = height / 2;

        svg.append('line')
            .attr('class', 'nn-connection')
            .attr('id', `conn-h${i}-out`)
            .attr('x1', x1 + 25)
            .attr('y1', y1)
            .attr('x2', x2 - 25)
            .attr('y2', y2)
            .attr('stroke', 'rgba(255, 255, 255, 0.2)')
            .attr('stroke-width', 2);
    }

    // Draw neurons
    layers.forEach((neuronCount, layerIndex) => {
        const x = layerYPositions[layerIndex];
        const startY = height / 2 - (neuronCount - 1) * neuronSpacing / 2;

        for (let i = 0; i < neuronCount; i++) {
            const y = startY + i * neuronSpacing;
            const neuronId = `neuron-${layerIndex}-${i}`;

            svg.append('circle')
                .attr('id', neuronId)
                .attr('class', 'nn-neuron')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', 25)
                .attr('fill', '#1d2125')
                .attr('stroke', 'rgba(255, 255, 255, 0.3)')
                .attr('stroke-width', 2)
                .attr('data-layer', layerIndex)
                .attr('data-index', i);

            // Label
            let label = '';
            if (layerIndex === 0) label = `I${i + 1}`;
            else if (layerIndex === 1) label = `H${i + 1}`;
            else label = 'Out';

            svg.append('text')
                .attr('x', x)
                .attr('y', y)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .attr('fill', 'white')
                .attr('font-size', '12px')
                .text(label);
        }
    });

    // Layer labels
    svg.append('text').attr('x', layerYPositions[0] - 80).attr('y', 50)
        .attr('fill', 'white').attr('font-size', '16px').text('Input Layer');
    svg.append('text').attr('x', layerYPositions[1] - 30).attr('y', 50)
        .attr('fill', 'white').attr('font-size', '16px').text('Hidden Layer');
    svg.append('text').attr('x', layerYPositions[2] - 30).attr('y', 50)
        .attr('fill', 'white').attr('font-size', '16px').text('Output Layer');
}

function highlightNeuralNetworkPath(result) {
    // Clear previous highlights
    d3.selectAll('.nn-neuron').classed('active', false);
    d3.selectAll('.nn-connection').classed('active', false);

    // Highlight based on activation values
    if (result) {
        // Input layer
        result.inputs.forEach((val, i) => {
            const neuron = d3.select(`#neuron-0-${i}`);
            neuron.classed('active', val > 0.5);
        });

        // Hidden layer
        result.hidden.forEach((val, i) => {
            const neuron = d3.select(`#neuron-1-${i}`);
            neuron.classed('active', val > 0.5);
            
            // Highlight connections to output
            d3.select(`#conn-h${i}-out`).classed('active', val > 0.5);
        });

        // Output layer
        const outputNeuron = d3.select('#neuron-2-0');
        outputNeuron.classed('active', result.output > 0.5);
    }
}

// K-Means Visualization
function renderKMeans(k = 3) {
    const ctx = document.getElementById('k-means-chart');
    if (!ctx) return;

    kMeansModel.train(datasets.kMeans, k);
    const clusters = kMeansModel.clusters;
    const centroids = kMeansModel.centroids;

    const clusterColors = ['#4ade80', '#60a5fa', '#f87171', '#a78bfa', '#fbbf24', '#34d399'];

    const chartDatasets = clusters.map((cluster, i) => ({
        label: `Cluster ${i + 1}`,
        data: cluster,
        backgroundColor: clusterColors[i % clusterColors.length],
        borderColor: clusterColors[i % clusterColors.length],
        pointRadius: 6
    }));

    chartDatasets.push({
        label: 'Centroids',
        data: centroids,
        backgroundColor: '#fff',
        borderColor: '#fff',
        pointRadius: 10,
        pointStyle: 'star'
    });

    if (kMeansChart) kMeansChart.destroy();

    kMeansChart = new Chart(ctx, {
        type: 'scatter',
        data: { datasets: chartDatasets },
        options: {
            responsive: true,
            plugins: { legend: { labels: { color: 'white' } } },
            scales: {
                x: { ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
                y: { ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
            }
        }
    });
}

// KNN Visualization
function renderKNN() {
    const ctx = document.getElementById('knn-chart');
    if (!ctx) return;

    const classes = [...new Set(datasets.knn.map(p => p.class))];
    const colors = { 'A': '#4ade80', 'B': '#60a5fa', 'C': '#f87171' };

    const chartDatasets = classes.map(cls => ({
        label: `Class ${cls}`,
        data: datasets.knn.filter(p => p.class === cls),
        backgroundColor: colors[cls],
        borderColor: colors[cls],
        pointRadius: 6
    }));

    if (customData.knn && customData.knn.length > 0) {
        chartDatasets.push({
            label: 'Test Point',
            data: customData.knn,
            backgroundColor: '#ff6b6b',
            borderColor: '#fff',
            pointRadius: 8,
            pointStyle: 'triangle'
        });
    }

    if (knnChart) knnChart.destroy();

    knnChart = new Chart(ctx, {
        type: 'scatter',
        data: { datasets: chartDatasets },
        options: {
            responsive: true,
            plugins: { legend: { labels: { color: 'white' } } },
            scales: {
                x: { ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
                y: { ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
            }
        }
    });
}

// Random Forest Visualization
function renderRandomForest() {
    const container = document.getElementById('random-forest-viz');
    if (!container) return;

    container.innerHTML = `
        <div class="standard-card">
            <h5>Random Forest Visualization</h5>
            <p>Random Forest combines multiple decision trees. Each tree votes on the classification, and the majority class wins.</p>
            <div class="mt-3">
                <div class="d-flex flex-wrap gap-3">
                    ${Array(5).fill(0).map((_, i) => `
                        <div class="border rounded p-3" style="min-width: 150px; border-color: rgba(255,255,255,0.1);">
                            <h6>Tree ${i + 1}</h6>
                            <p class="mb-0 small">Vote: Class ${['A', 'B', 'C'][i % 3]}</p>
                        </div>
                    `).join('')}
                </div>
                <div class="mt-3 p-3 bg-secondary rounded">
                    <strong>Final Prediction:</strong> Class B (Majority Vote)
                </div>
            </div>
        </div>
    `;
}

// SVM Visualization
function renderSVM() {
    const ctx = document.getElementById('svm-chart');
    if (!ctx) return;

    const data = datasets.logisticRegression;
    const classes = [...new Set(data.map(p => p.y))];
    const colors = { 0: '#ef4444', 1: '#4ade80' };

    const boundaryPoints = [];
    for (let x = 0; x <= 1; x += 0.01) {
        boundaryPoints.push({ x: x, y: svmModel.getHyperplane(x) });
    }

    const chartDatasets = [
        {
            label: 'Class 0',
            data: data.filter(p => p.y === 0),
            backgroundColor: colors[0],
            borderColor: colors[0],
            pointRadius: 6
        },
        {
            label: 'Class 1',
            data: data.filter(p => p.y === 1),
            backgroundColor: colors[1],
            borderColor: colors[1],
            pointRadius: 6
        },
        {
            label: 'Decision Boundary',
            data: boundaryPoints,
            type: 'line',
            borderColor: '#60a5fa',
            borderWidth: 2,
            pointRadius: 0,
            fill: false
        }
    ];

    if (svmChart) svmChart.destroy();

    svmChart = new Chart(ctx, {
        type: 'scatter',
        data: { datasets: chartDatasets },
        options: {
            responsive: true,
            plugins: { legend: { labels: { color: 'white' } } },
            scales: {
                x: { min: 0, max: 1, ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
                y: { min: -0.1, max: 1.1, ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
            }
        }
    });
}

// NLP Pipeline Visualization
function renderNLP() {
    const container = document.getElementById('nlp-viz');
    if (!container) return;
}

function renderNLPPipeline(sentence) {
    const result = nlpProcessor.process(sentence);
    const container = document.getElementById('nlp-pipeline');
    if (!container) return;

    container.innerHTML = `
        <div class="standard-card">
            <h5>Original Sentence</h5>
            <p class="mb-0">"${result.original}"</p>
        </div>
        <div class="standard-card">
            <h5>Tokenization</h5>
            <div class="d-flex flex-wrap gap-2">
                ${result.tokens.map(token => `<span class="badge bg-primary">${token}</span>`).join('')}
            </div>
        </div>
        <div class="standard-card">
            <h5>After Stop Word Removal</h5>
            <div class="d-flex flex-wrap gap-2">
                ${result.filtered.map(token => `<span class="badge bg-success">${token}</span>`).join('')}
            </div>
        </div>
        <div class="standard-card">
            <h5>Generated Response</h5>
            <p class="mb-0 fs-5">"${result.response}"</p>
        </div>
    `;
}
