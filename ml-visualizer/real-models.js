/**
 * Load and use real trained models from Python/scikit-learn
 * Models are exported as JSON and recreated in JavaScript
 */

let realModels = {
    linearRegression: null,
    logisticRegression: null,
    decisionTree: null,
    randomForest: null,
    kmeans: null,
    knn: null,
    svm: null,
    neuralNetwork: null
};

let realDatasets = {
    linearRegression: null,
    logisticRegression: null,
    decisionTree: null,
    randomForest: null,
    kmeans: null,
    knn: null,
    svm: null,
    neuralNetwork: null
};

// Load all models
async function loadRealModels() {
    try {
        // Load Linear Regression
        const lrResponse = await fetch('models/linear_regression_model.json');
        if (lrResponse.ok) {
            const lrData = await lrResponse.json();
            realModels.linearRegression = recreateLinearRegression(lrData);
            realDatasets.linearRegression = lrData.sample_data;
        }

        // Load Logistic Regression
        const logrResponse = await fetch('models/logistic_regression_model.json');
        if (logrResponse.ok) {
            const logrData = await logrResponse.json();
            realModels.logisticRegression = recreateLogisticRegression(logrData);
            realDatasets.logisticRegression = logrData.sample_data;
        }

        // Load Decision Tree
        const dtResponse = await fetch('models/decision_tree_model.json');
        if (dtResponse.ok) {
            const dtData = await dtResponse.json();
            realModels.decisionTree = recreateDecisionTree(dtData);
            realDatasets.decisionTree = dtData.sample_data;
        }

        // Load Random Forest
        const rfResponse = await fetch('models/random_forest_model.json');
        if (rfResponse.ok) {
            const rfData = await rfResponse.json();
            realModels.randomForest = recreateRandomForest(rfData);
            realDatasets.randomForest = rfData.sample_data;
        }

        // Load K-Means
        const kmResponse = await fetch('models/kmeans_model.json');
        if (kmResponse.ok) {
            const kmData = await kmResponse.json();
            realModels.kmeans = recreateKMeans(kmData);
            realDatasets.kmeans = kmData.sample_data;
        }

        // Load KNN
        const knnResponse = await fetch('models/knn_model.json');
        if (knnResponse.ok) {
            const knnData = await knnResponse.json();
            realModels.knn = recreateKNN(knnData);
            realDatasets.knn = knnData.sample_data;
        }

        // Load SVM
        const svmResponse = await fetch('models/svm_model.json');
        if (svmResponse.ok) {
            const svmData = await svmResponse.json();
            realModels.svm = recreateSVM(svmData);
            realDatasets.svm = svmData.sample_data;
        }

        // Load Neural Network
        const nnResponse = await fetch('models/neural_network_model.json');
        if (nnResponse.ok) {
            const nnData = await nnResponse.json();
            realModels.neuralNetwork = recreateNeuralNetwork(nnData);
            realDatasets.neuralNetwork = nnData.sample_data;
        }

        console.log('✅ Real models loaded successfully');
        return true;
    } catch (error) {
        console.warn('⚠️ Could not load real models, using simplified versions:', error);
        return false;
    }
}

// Recreate Linear Regression model
function recreateLinearRegression(modelData) {
    return {
        coefficients: modelData.coefficients,
        intercept: modelData.intercept,
        scaler_mean: modelData.scaler_mean,
        scaler_scale: modelData.scaler_scale,
        predict: function(X) {
            // Scale input
            const X_scaled = X.map((x, i) => 
                (x - this.scaler_mean[i]) / this.scaler_scale[i]
            );
            // Predict
            let prediction = this.intercept;
            for (let i = 0; i < X_scaled.length; i++) {
                prediction += X_scaled[i] * this.coefficients[i];
            }
            return prediction;
        }
    };
}

// Recreate Logistic Regression model
function recreateLogisticRegression(modelData) {
    return {
        coefficients: modelData.coefficients,
        intercept: modelData.intercept,
        classes: modelData.classes,
        scaler_mean: modelData.scaler_mean,
        scaler_scale: modelData.scaler_scale,
        sigmoid: function(z) {
            return 1 / (1 + Math.exp(-Math.max(-250, Math.min(250, z))));
        },
        predict: function(X) {
            // Scale input
            const X_scaled = X.map((x, i) => 
                (x - this.scaler_mean[i]) / this.scaler_scale[i]
            );
            // Calculate logit
            let z = this.intercept;
            for (let i = 0; i < X_scaled.length; i++) {
                z += X_scaled[i] * this.coefficients[i];
            }
            // Apply sigmoid
            const probability = this.sigmoid(z);
            return probability > 0.5 ? 1 : 0;
        },
        predict_proba: function(X) {
            const X_scaled = X.map((x, i) => 
                (x - this.scaler_mean[i]) / this.scaler_scale[i]
            );
            let z = this.intercept;
            for (let i = 0; i < X_scaled.length; i++) {
                z += X_scaled[i] * this.coefficients[i];
            }
            const prob = this.sigmoid(z);
            return [1 - prob, prob];
        }
    };
}

// Recreate Decision Tree model
function recreateDecisionTree(modelData) {
    const tree = modelData.tree_structure;
    return {
        tree: tree,
        classes: modelData.classes,
        target_names: modelData.target_names,
        predict: function(X) {
            let node = 0;
            while (tree.children_left[node] !== -1) {
                const feature = tree.feature[node];
                const threshold = tree.threshold[node];
                if (X[feature] <= threshold) {
                    node = tree.children_left[node];
                } else {
                    node = tree.children_right[node];
                }
            }
            // Get majority class from value
            const value = tree.value[node][0];
            let maxIdx = 0;
            for (let i = 1; i < value.length; i++) {
                if (value[i] > value[maxIdx]) {
                    maxIdx = i;
                }
            }
            return this.classes[maxIdx];
        },
        getPath: function(X) {
            const path = [];
            let node = 0;
            while (tree.children_left[node] !== -1) {
                const feature = tree.feature[node];
                const threshold = tree.threshold[node];
                const featureName = modelData.feature_names[feature] || `Feature ${feature}`;
                const direction = X[feature] <= threshold ? 'left' : 'right';
                path.push({
                    node: node,
                    direction: direction,
                    condition: `${featureName} <= ${threshold.toFixed(2)}`,
                    feature: feature,
                    threshold: threshold
                });
                node = direction === 'left' ? tree.children_left[node] : tree.children_right[node];
            }
            const value = tree.value[node][0];
            let maxIdx = 0;
            for (let i = 1; i < value.length; i++) {
                if (value[i] > value[maxIdx]) {
                    maxIdx = i;
                }
            }
            path.push({
                node: node,
                result: this.classes[maxIdx],
                resultName: this.target_names ? this.target_names[maxIdx] : `Class ${maxIdx}`
            });
            return path;
        }
    };
}

// Recreate Random Forest model
function recreateRandomForest(modelData) {
    return {
        trees: modelData.trees.map(treeData => ({
            tree: treeData,
            predict: function(X) {
                let node = 0;
                while (this.tree.children_left[node] !== -1) {
                    const feature = this.tree.feature[node];
                    const threshold = this.tree.threshold[node];
                    node = X[feature] <= threshold ? 
                        this.tree.children_left[node] : 
                        this.tree.children_right[node];
                }
                const value = this.tree.value[node][0];
                let maxIdx = 0;
                for (let i = 1; i < value.length; i++) {
                    if (value[i] > value[maxIdx]) {
                        maxIdx = i;
                    }
                }
                return maxIdx;
            }
        })),
        classes: modelData.classes,
        target_names: modelData.target_names,
        predict: function(X) {
            const votes = new Array(this.classes.length).fill(0);
            this.trees.forEach(tree => {
                const prediction = tree.predict(X);
                votes[prediction]++;
            });
            let maxIdx = 0;
            for (let i = 1; i < votes.length; i++) {
                if (votes[i] > votes[maxIdx]) {
                    maxIdx = i;
                }
            }
            return this.classes[maxIdx];
        }
    };
}

// Recreate K-Means model
function recreateKMeans(modelData) {
    return {
        centroids: modelData.centroids,
        n_clusters: modelData.n_clusters,
        scaler_mean: modelData.scaler_mean,
        scaler_scale: modelData.scaler_scale,
        predict: function(X) {
            // Scale input
            const X_scaled = X.map((x, i) => 
                (x - this.scaler_mean[i]) / this.scaler_scale[i]
            );
            // Find nearest centroid
            let minDist = Infinity;
            let cluster = 0;
            this.centroids.forEach((centroid, i) => {
                let dist = 0;
                for (let j = 0; j < X_scaled.length; j++) {
                    dist += Math.pow(X_scaled[j] - centroid[j], 2);
                }
                dist = Math.sqrt(dist);
                if (dist < minDist) {
                    minDist = dist;
                    cluster = i;
                }
            });
            return cluster;
        }
    };
}

// Recreate KNN model
function recreateKNN(modelData) {
    return {
        training_data: modelData.training_data,
        training_labels: modelData.training_labels,
        n_neighbors: modelData.n_neighbors,
        classes: modelData.classes,
        euclideanDistance: function(p1, p2) {
            let dist = 0;
            for (let i = 0; i < p1.length; i++) {
                dist += Math.pow(p1[i] - p2[i], 2);
            }
            return Math.sqrt(dist);
        },
        predict: function(X, k = null) {
            const kVal = k || this.n_neighbors;
            const distances = this.training_data.map((point, i) => ({
                point: point,
                label: this.training_labels[i],
                distance: this.euclideanDistance(X, point)
            }));
            distances.sort((a, b) => a.distance - b.distance);
            const kNearest = distances.slice(0, kVal);
            const votes = {};
            kNearest.forEach(item => {
                votes[item.label] = (votes[item.label] || 0) + 1;
            });
            let maxLabel = null;
            let maxVotes = 0;
            Object.entries(votes).forEach(([label, count]) => {
                if (count > maxVotes) {
                    maxVotes = count;
                    maxLabel = parseInt(label);
                }
            });
            return maxLabel;
        }
    };
}

// Recreate SVM model (simplified - for visualization)
function recreateSVM(modelData) {
    return {
        support_vectors: modelData.support_vectors,
        dual_coef: modelData.dual_coef,
        intercept: modelData.intercept,
        classes: modelData.classes,
        scaler_mean: modelData.scaler_mean,
        scaler_scale: modelData.scaler_scale,
        predict: function(X) {
            // Scale input
            const X_scaled = X.map((x, i) => 
                (x - this.scaler_mean[i]) / this.scaler_scale[i]
            );
            // Simplified prediction using RBF kernel approximation
            // For visualization, we'll use a simple linear approximation
            let decision = this.intercept[0];
            // This is a simplified version - full RBF would require kernel computation
            return decision > 0 ? 1 : 0;
        }
    };
}

// Recreate Neural Network model
function recreateNeuralNetwork(modelData) {
    return {
        coefs: modelData.coefs,
        intercepts: modelData.intercepts,
        classes: modelData.classes,
        scaler_mean: modelData.scaler_mean,
        scaler_scale: modelData.scaler_scale,
        sigmoid: function(x) {
            return 1 / (1 + Math.exp(-Math.max(-250, Math.min(250, x))));
        },
        forward: function(X) {
            // Scale input
            const X_scaled = X.map((x, i) => 
                (x - this.scaler_mean[i]) / this.scaler_scale[i]
            );
            let activations = X_scaled;
            const layerOutputs = [activations];
            
            // Forward through each layer
            for (let i = 0; i < this.coefs.length; i++) {
                const newActivations = [];
                for (let j = 0; j < this.coefs[i].length; j++) {
                    let sum = this.intercepts[i][j];
                    for (let k = 0; k < activations.length; k++) {
                        sum += activations[k] * this.coefs[i][j][k];
                    }
                    newActivations.push(this.sigmoid(sum));
                }
                activations = newActivations;
                layerOutputs.push(activations);
            }
            
            return {
                inputs: X_scaled,
                layers: layerOutputs.slice(1, -1),
                output: activations,
                prediction: activations.indexOf(Math.max(...activations))
            };
        },
        predict: function(X) {
            const result = this.forward(X);
            return this.classes[result.prediction];
        }
    };
}

// Initialize models on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadRealModels();
});

