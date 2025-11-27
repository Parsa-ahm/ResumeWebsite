/**
 * Console Window for Step-by-Step Processing
 */

// Centralized timing control for slow-motion simulation
let STEP_DELAY = 600; // Base delay in milliseconds
let PLAYBACK_SPEED = window.PLAYBACK_SPEED || 1.0; // 1.0 = normal, 0.5 = half speed, 2.0 = double speed

// Helper to get adjusted delay based on playback speed
function getDelay(baseDelay = STEP_DELAY) {
    const speed = window.PLAYBACK_SPEED || PLAYBACK_SPEED || 1.0;
    return baseDelay / speed;
}

let consoleOpen = false;

function toggleConsole() {
    const consoleWindow = document.getElementById('console-window');
    consoleOpen = !consoleOpen;
    if (consoleOpen) {
        consoleWindow.classList.add('open');
    } else {
        consoleWindow.classList.remove('open');
    }
}

function clearConsole() {
    const consoleBody = document.getElementById('console-body');
    consoleBody.innerHTML = '';
}

function logToConsole(message, type = 'info') {
    const consoleBody = document.getElementById('console-body');
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    line.textContent = message;
    consoleBody.appendChild(line);
    consoleBody.scrollTop = consoleBody.scrollHeight;
    
    // Auto-open console if it's closed
    if (!consoleOpen) {
        toggleConsole();
    }
}

function logStep(stepNumber, description, type = 'info') {
    logToConsole(`[Step ${stepNumber}] ${description}`, type);
}

// Decision Tree Console Output
function logDecisionTreeProcess(point) {
    clearConsole();
    logToConsole('=== Decision Tree Processing ===', 'info');
    logToConsole(`Processing point: Age=${point.age}, Income=${point.income}`, 'info');
    
    logStep(1, 'Loading dataset...', 'info');
                    setTimeout(() => {
                        logStep(2, 'Pre-processing: Checking for missing values...', 'info');
                        setTimeout(() => {
                            logStep(3, 'Pre-processing: All values present, no imputation needed', 'success');
                            setTimeout(() => {
                                logStep(4, 'Starting tree traversal...', 'info');
                                setTimeout(() => {
                                    logStep(5, `Evaluating root node: Income <= 45000?`, 'info');
                                    setTimeout(() => {
                                        const condition = point.income <= 45000 ? 'Yes' : 'No';
                                        logStep(6, `Condition result: ${condition}`, 'success');
                                        setTimeout(() => {
                                            logStep(7, 'Moving to child node...', 'info');
                                            setTimeout(() => {
                                                const prediction = decisionTreeModel.predict(point);
                                                logStep(8, `Reached leaf node. Prediction: ${prediction}`, 'success');
                                                logToConsole('=== Processing Complete ===', 'success');
                                            }, getDelay());
                                        }, getDelay());
                                    }, getDelay());
                                }, getDelay());
                            }, getDelay());
                        }, getDelay());
                    }, getDelay());
}

// Linear Regression Console Output
function logLinearRegressionProcess(point) {
    clearConsole();
    logToConsole('=== Linear Regression Processing ===', 'info');
    logToConsole(`Predicting Y for X = ${point.x}`, 'info');
    
    logStep(1, 'Loading training data...', 'info');
    setTimeout(() => {
        logStep(2, 'Pre-processing: Normalizing features...', 'info');
        setTimeout(() => {
            logStep(3, 'Pre-processing: Feature normalization complete', 'success');
            setTimeout(() => {
                logStep(4, 'Calculating regression coefficients...', 'info');
                setTimeout(() => {
                    logStep(5, `Slope (m) = ${linearRegressionModel.slope.toFixed(4)}`, 'info');
                    setTimeout(() => {
                        logStep(6, `Intercept (b) = ${linearRegressionModel.intercept.toFixed(4)}`, 'info');
                        setTimeout(() => {
                            const prediction = linearRegressionModel.predict(point.x);
                            logStep(7, `Applying formula: y = mx + b`, 'info');
                            setTimeout(() => {
                                logStep(8, `Prediction: y = ${prediction.toFixed(2)}`, 'success');
                                logToConsole('=== Processing Complete ===', 'success');
                            }, getDelay());
                        }, getDelay());
                    }, getDelay());
                }, getDelay());
            }, getDelay());
        }, getDelay());
    }, getDelay());
}

// Random Forest Console Output
function logRandomForestProcess(point) {
    clearConsole();
    logToConsole('=== Random Forest Processing ===', 'info');
    logToConsole(`Classifying point: Age=${point.age}, Income=${point.income}`, 'info');
    
    logStep(1, 'Initializing 5 decision trees...', 'info');
    setTimeout(() => {
        logStep(2, 'Pre-processing: Removing tax column (no information gain)', 'warning');
        setTimeout(() => {
            logStep(3, 'Pre-processing: Feature selection complete', 'success');
            setTimeout(() => {
                logStep(4, 'Tree 1: Processing...', 'info');
                setTimeout(() => {
                    logStep(5, 'Tree 1: Vote = Class A', 'info');
                    setTimeout(() => {
                        logStep(6, 'Tree 2: Vote = Class B', 'info');
                        setTimeout(() => {
                            logStep(7, 'Tree 3: Vote = Class B', 'info');
                            setTimeout(() => {
                                logStep(8, 'Tree 4: Vote = Class B', 'info');
                                setTimeout(() => {
                                    logStep(9, 'Tree 5: Vote = Class A', 'info');
                                    setTimeout(() => {
                                        logStep(10, 'Post-processing: Counting votes...', 'info');
                                        setTimeout(() => {
                                            logStep(11, 'Votes: Class A = 2, Class B = 3', 'info');
                                            setTimeout(() => {
                                                logStep(12, 'Final Prediction: Class B (Majority Vote)', 'success');
                                                logToConsole('=== Processing Complete ===', 'success');
                                            }, 500);
                                        }, 500);
                                    }, 500);
                                }, 500);
                            }, 500);
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
    }, 500);
}

// K-Means Console Output
function logKMeansProcess(k) {
    clearConsole();
    logToConsole('=== K-Means Clustering Processing ===', 'info');
    logToConsole(`Clustering data into ${k} clusters`, 'info');
    
    logStep(1, 'Loading dataset...', 'info');
    setTimeout(() => {
        logStep(2, 'Pre-processing: Normalizing features...', 'info');
        setTimeout(() => {
            logStep(3, 'Pre-processing: Normalization complete', 'success');
            setTimeout(() => {
                logStep(4, `Initializing ${k} random centroids...`, 'info');
                setTimeout(() => {
                    logStep(5, 'Iteration 1: Assigning points to nearest centroids...', 'info');
                    setTimeout(() => {
                        logStep(6, 'Iteration 1: Updating centroid positions...', 'info');
                        setTimeout(() => {
                            logStep(7, 'Iteration 2: Reassigning points...', 'info');
                            setTimeout(() => {
                                logStep(8, 'Convergence reached!', 'success');
                                logToConsole('=== Processing Complete ===', 'success');
                            }, 500);
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
    }, 500);
}

// KNN Console Output
function logKNNProcess(point, k) {
    clearConsole();
    logToConsole('=== K-Nearest Neighbors Processing ===', 'info');
    logToConsole(`Classifying point: (${point.x}, ${point.y}) with k=${k}`, 'info');
    
    logStep(1, 'Loading training dataset...', 'info');
    setTimeout(() => {
        logStep(2, 'Pre-processing: Normalizing features...', 'info');
        setTimeout(() => {
            logStep(3, 'Pre-processing: Normalization complete', 'success');
            setTimeout(() => {
                logStep(4, 'Calculating distances to all training points...', 'info');
                setTimeout(() => {
                    logStep(5, 'Sorting distances...', 'info');
                    setTimeout(() => {
                        logStep(6, `Selecting ${k} nearest neighbors...`, 'info');
                        setTimeout(() => {
                            logStep(7, 'Counting class votes...', 'info');
                            setTimeout(() => {
                                const prediction = knnModel.predict(point, k);
                                logStep(8, `Prediction: ${prediction} (Majority class)`, 'success');
                                logToConsole('=== Processing Complete ===', 'success');
                            }, 500);
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
    }, 500);
}

// SVM Console Output
function logSVMProcess() {
    clearConsole();
    logToConsole('=== Support Vector Machine Processing ===', 'info');
    
    logStep(1, 'Loading training data...', 'info');
    setTimeout(() => {
        logStep(2, 'Pre-processing: Feature scaling...', 'info');
        setTimeout(() => {
            logStep(3, 'Pre-processing: Scaling complete', 'success');
            setTimeout(() => {
                logStep(4, 'Finding optimal hyperplane...', 'info');
                setTimeout(() => {
                    logStep(5, 'Identifying support vectors...', 'info');
                    setTimeout(() => {
                        logStep(6, 'Calculating margin...', 'info');
                        setTimeout(() => {
                            logStep(7, 'Hyperplane optimized!', 'success');
                            logToConsole('=== Processing Complete ===', 'success');
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
    }, 500);
}

// NLP Console Output
function logNLPProcess(sentence) {
    clearConsole();
    logToConsole('=== Natural Language Processing ===', 'info');
    logToConsole(`Processing: "${sentence}"`, 'info');
    
    logStep(1, 'Tokenization: Splitting sentence into words...', 'info');
    setTimeout(() => {
        const tokens = sentence.toLowerCase().split(/\s+/);
        logStep(2, `Found ${tokens.length} tokens`, 'success');
        setTimeout(() => {
            logStep(3, 'Removing stop words (the, a, an, etc.)...', 'info');
            setTimeout(() => {
                const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
                const filtered = tokens.filter(t => !stopWords.includes(t));
                logStep(4, `Removed ${tokens.length - filtered.length} stop words`, 'success');
                setTimeout(() => {
                    logStep(5, 'Analyzing keywords for response generation...', 'info');
                    setTimeout(() => {
                        logStep(6, 'Generating contextual response...', 'info');
                        setTimeout(() => {
                            const result = nlpProcessor.process(sentence);
                            logStep(7, `Response: "${result.response}"`, 'success');
                            logToConsole('=== Processing Complete ===', 'success');
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
    }, 500);
}


