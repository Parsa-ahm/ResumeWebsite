/**
 * Interactive Event Handlers and User Interactions
 */

// Tab switching
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.algorithm-tab');
    const contents = document.querySelectorAll('.algorithm-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const algorithm = this.getAttribute('data-algorithm');

            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(algorithm).classList.add('active');

            // Re-render visualizations if needed
            if (algorithm === 'decision-tree') {
                renderDecisionTree();
            } else if (algorithm === 'linear-regression') {
                renderLinearRegression();
            } else if (algorithm === 'logistic-regression') {
                renderLogisticRegression();
            } else if (algorithm === 'neural-network') {
                renderNeuralNetwork();
            } else if (algorithm === 'k-means') {
                renderKMeans();
            } else if (algorithm === 'knn') {
                renderKNN();
            } else if (algorithm === 'random-forest') {
                renderRandomForest();
            } else if (algorithm === 'svm') {
                renderSVM();
                logSVMProcess();
                animateSVMBoundary();
            } else if (algorithm === 'nlp') {
                renderNLP();
            }
            
            // Populate dataset tables when switching tabs
            if (algorithm === 'decision-tree') {
                populateLoanDataset();
            } else if (algorithm === 'linear-regression') {
                populateHousePriceDataset();
            } else if (algorithm === 'logistic-regression') {
                populateEmailSpamDataset();
            } else if (algorithm === 'k-means') {
                populateCustomerSegmentationDataset();
            }
        });
    });

    // Initialize visualizations
    initializeVisualizations();
    
    // Populate all datasets on page load
    populateAllDatasets();
});

// K-Means functions
function runKMeans() {
    const k = parseInt(document.getElementById('k-means-k').value);
    if (kMeansChart) {
        kMeansChart.destroy();
    }
    logKMeansProcess(k);
    animateKMeansClustering(k);
}

// KNN functions
function classifyKNN() {
    const x = parseFloat(document.getElementById('knn-x').value);
    const y = parseFloat(document.getElementById('knn-y').value);
    const k = parseInt(document.getElementById('knn-k').value);
    
    const point = { x: x, y: y };
    
    logKNNProcess(point, k);
    animateKNNClassification(point, k);
}

// NLP functions
function processNLP() {
    const sentence = document.getElementById('nlp-sentence').value;
    if (!sentence.trim()) {
        alert('Please enter a sentence');
        return;
    }
    logNLPProcess(sentence);
    renderNLPPipeline(sentence);
}

// Add data point to Decision Tree
function addDecisionTreePoint() {
    const age = parseFloat(document.getElementById('dt-feature1').value);
    const income = parseFloat(document.getElementById('dt-feature2').value);

    if (isNaN(age) || isNaN(income)) {
        alert('Please enter valid numbers');
        return;
    }

    const point = { age: age, income: income };
    customData.decisionTree.push(point);

    // Re-render decision tree visualization
    renderDecisionTree();

    // Animate and log
    logDecisionTreeProcess(point);
    animateDecisionTreePath(point);
}

// Add data point to Linear Regression
function addLinearRegressionPoint() {
    const x = parseFloat(document.getElementById('lr-x').value);
    const y = parseFloat(document.getElementById('lr-y').value);

    if (isNaN(x) || isNaN(y)) {
        alert('Please enter valid numbers');
        return;
    }

    const point = { x: x, y: y };
    const prediction = linearRegressionModel.predict(x);
    const error = Math.abs(prediction - y);

    customData.linearRegression.push(point);

    // Retrain model with new data
    const allData = [...datasets.linearRegression, ...customData.linearRegression];
    linearRegressionModel.train(allData);

    // Re-render visualization
    renderLinearRegression();

    // Show result
    alert(`Data Point Added!\nPoint: (${x}, ${y})\nPredicted Y: ${prediction.toFixed(2)}\nError: ${error.toFixed(2)}`);
}

// Add data point to Logistic Regression
function addLogisticRegressionPoint() {
    const x = parseFloat(document.getElementById('logr-x').value);
    const y = parseInt(document.getElementById('logr-y').value);

    if (isNaN(x) || (y !== 0 && y !== 1)) {
        alert('Please enter valid values. X should be a number, Y should be 0 or 1');
        return;
    }

    const point = { x: x, y: y };
    const probability = logisticRegressionModel.getProbability(x);
    const prediction = probability > 0.5 ? 1 : 0;

    customData.logisticRegression.push(point);

    // Retrain model with new data
    const allData = [...datasets.logisticRegression, ...customData.logisticRegression];
    logisticRegressionModel.train(allData);

    // Re-render visualization
    renderLogisticRegression();

    // Show result
    alert(`Data Point Added!\nPoint: (${x.toFixed(2)}, ${y})\nProbability: ${probability.toFixed(3)}\nPrediction: Class ${prediction}`);
}

// Propagate through Neural Network
function propagateNeuralNetwork() {
    const input1 = parseFloat(document.getElementById('nn-input1').value);
    const input2 = parseFloat(document.getElementById('nn-input2').value);

    if (isNaN(input1) || isNaN(input2) || input1 < 0 || input1 > 1 || input2 < 0 || input2 > 1) {
        alert('Please enter valid values between 0 and 1');
        return;
    }

    const inputs = [input1, input2];
    
    clearConsole();
    logToConsole('=== Neural Network Forward Pass ===', 'info');
    logToConsole(`Input: [${input1.toFixed(2)}, ${input2.toFixed(2)}]`, 'info');
    
    logStep(1, 'Pre-processing: Normalizing inputs...', 'info');
    setTimeout(() => {
        logStep(2, 'Pre-processing: Inputs normalized', 'success');
        setTimeout(() => {
            logStep(3, 'Forward pass: Computing hidden layer activations...', 'info');
            setTimeout(() => {
                const result = neuralNetwork.forward(inputs);
                logStep(4, `Hidden layer: [${result.hidden.map(v => v.toFixed(3)).join(', ')}]`, 'info');
                setTimeout(() => {
                    logStep(5, 'Computing output layer...', 'info');
                    setTimeout(() => {
                        logStep(6, `Output: ${result.output.toFixed(3)}`, 'success');
                        logStep(7, `Classification: ${result.output > 0.5 ? 'Class 1' : 'Class 0'}`, 'success');
                        logToConsole('=== Processing Complete ===', 'success');
                        
                        // Update neuron values after animation
                        updateNeuralNetworkValues(result);
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
    }, 500);

    // Animate the forward pass
    animateNeuralNetworkForward(inputs);
}

function updateNeuralNetworkValues(result) {
    // Update input neurons
    result.inputs.forEach((val, i) => {
        const neuron = d3.select(`#neuron-0-${i}`);
        neuron.attr('fill', val > 0.5 ? '#4a90e2' : '#1d2125');
        
        // Update text to show value
        const text = d3.select(`#neuron-0-${i}`).node().nextElementSibling;
        if (text) {
            text.textContent = `I${i + 1}: ${val.toFixed(2)}`;
        }
    });

    // Update hidden neurons
    result.hidden.forEach((val, i) => {
        const neuron = d3.select(`#neuron-1-${i}`);
        neuron.attr('fill', val > 0.5 ? '#4a90e2' : '#1d2125');
        
        const text = d3.select(`#neuron-1-${i}`).node().nextElementSibling;
        if (text) {
            text.textContent = `H${i + 1}: ${val.toFixed(2)}`;
        }
    });

    // Update output neuron
    const outputNeuron = d3.select(`#neuron-2-0`);
    outputNeuron.attr('fill', result.output > 0.5 ? '#4a90e2' : '#1d2125');
    
    const outputText = d3.select(`#neuron-2-0`).node().nextElementSibling;
    if (outputText) {
        outputText.textContent = `Out: ${result.output.toFixed(2)}`;
    }
}

// Populate real-world dataset tables
function populateLoanDataset() {
    const tbody = document.getElementById('dt-dataset-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    datasets.loanDataset.slice(0, 12).forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.age}</td>
            <td>$${row.income.toLocaleString()}</td>
            <td>${row.creditScore}</td>
            <td>$${row.loanAmount.toLocaleString()}</td>
            <td>${row.approved}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Toggle dataset table expansion
function toggleDatasetTable(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const isExpanded = container.classList.contains('expanded');
    const toggle = event.target;
    
    if (isExpanded) {
        container.classList.remove('expanded');
        toggle.textContent = 'Show more rows';
    } else {
        container.classList.add('expanded');
        toggle.textContent = 'Show fewer rows';
    }
}

// Populate all dataset tables
function populateAllDatasets() {
    populateLoanDataset();
    populateHousePriceDataset();
    populateEmailSpamDataset();
    populateCustomerSegmentationDataset();
}

// House Price Dataset
function populateHousePriceDataset() {
    const tbody = document.getElementById('lr-dataset-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    datasets.housePriceDataset.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.size}</td>
            <td>${row.bedrooms}</td>
            <td>${row.age}</td>
            <td>$${row.price.toLocaleString()}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Email Spam Dataset
function populateEmailSpamDataset() {
    const tbody = document.getElementById('logr-dataset-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    datasets.emailSpamDataset.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.wordCount}</td>
            <td>${row.links}</td>
            <td>${row.uppercasePercent}%</td>
            <td>${row.spam}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Customer Segmentation Dataset
function populateCustomerSegmentationDataset() {
    const tbody = document.getElementById('kmeans-dataset-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    datasets.customerSegmentationDataset.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>$${row.annualIncome.toLocaleString()}</td>
            <td>${row.spendingScore}</td>
            <td>${row.age}</td>
            <td>${row.cluster || '-'}</td>
        `;
        tbody.appendChild(tr);
    });
}