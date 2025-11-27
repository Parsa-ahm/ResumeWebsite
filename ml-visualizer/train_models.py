"""
Train real ML models on public datasets and export them for visualization
"""

import json
import numpy as np
import pandas as pd
from sklearn.datasets import (
    load_iris, load_breast_cancer, load_wine, 
    fetch_california_housing
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor, export_text
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.cluster import KMeans
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier

import warnings
warnings.filterwarnings('ignore')

def export_model_to_json(model, model_type, dataset_name, scaler=None, feature_names=None):
    """Export trained model to JSON format"""
    model_data = {
        'type': model_type,
        'dataset': dataset_name,
        'feature_names': feature_names if feature_names is not None else []
    }
    
    if model_type == 'linear_regression':
        model_data['coefficients'] = model.coef_.tolist()
        model_data['intercept'] = float(model.intercept_)
        if scaler:
            model_data['scaler_mean'] = scaler.mean_.tolist()
            model_data['scaler_scale'] = scaler.scale_.tolist()
    
    elif model_type == 'logistic_regression':
        model_data['coefficients'] = model.coef_[0].tolist()
        model_data['intercept'] = float(model.intercept_[0])
        model_data['classes'] = model.classes_.tolist()
        if scaler:
            model_data['scaler_mean'] = scaler.mean_.tolist()
            model_data['scaler_scale'] = scaler.scale_.tolist()
    
    elif model_type == 'decision_tree':
        # Export tree structure
        tree = model.tree_
        model_data['tree_structure'] = {
            'children_left': tree.children_left.tolist(),
            'children_right': tree.children_right.tolist(),
            'feature': tree.feature.tolist(),
            'threshold': tree.threshold.tolist(),
            'value': tree.value.tolist(),
            'n_node_samples': tree.n_node_samples.tolist()
        }
        model_data['feature_names'] = feature_names if feature_names else []
        model_data['classes'] = model.classes_.tolist() if hasattr(model, 'classes_') else None
    
    elif model_type == 'random_forest':
        # Export all trees
        model_data['n_estimators'] = model.n_estimators
        model_data['trees'] = []
        model_data['classes'] = model.classes_.tolist() if hasattr(model, 'classes_') else None
        for i, tree in enumerate(model.estimators_):
            t = tree.tree_
            model_data['trees'].append({
                'children_left': t.children_left.tolist(),
                'children_right': t.children_right.tolist(),
                'feature': t.feature.tolist(),
                'threshold': t.threshold.tolist(),
                'value': t.value.tolist()
            })
    
    elif model_type == 'kmeans':
        model_data['n_clusters'] = model.n_clusters
        model_data['centroids'] = model.cluster_centers_.tolist()
        model_data['n_iter'] = int(model.n_iter_)
    
    elif model_type == 'knn':
        # For KNN, we store the training data
        model_data['training_data'] = model._fit_X.tolist()
        model_data['training_labels'] = model._y.tolist()
        model_data['n_neighbors'] = int(model.n_neighbors)
        model_data['classes'] = model.classes_.tolist() if hasattr(model, 'classes_') else []
    
    elif model_type == 'svm':
        model_data['support_vectors'] = model.support_vectors_.tolist()
        model_data['dual_coef'] = model.dual_coef_.tolist()
        model_data['intercept'] = model.intercept_.tolist()
        model_data['support'] = model.support_.tolist()
        model_data['classes'] = model.classes_.tolist()
        model_data['kernel'] = model.kernel
    
    elif model_type == 'neural_network':
        model_data['coefs'] = [coef.tolist() for coef in model.coefs_]
        model_data['intercepts'] = [intercept.tolist() for intercept in model.intercepts_]
        model_data['n_layers'] = model.n_layers_
        model_data['n_outputs'] = model.n_outputs_
        model_data['classes'] = model.classes_.tolist() if hasattr(model, 'classes_') else []
    
    return model_data

# 1. LINEAR REGRESSION - California Housing
print("Training Linear Regression on California Housing...")
housing = fetch_california_housing()
X, y = housing.data, housing.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler_lr = StandardScaler()
X_train_scaled = scaler_lr.fit_transform(X_train)

lr_model = LinearRegression()
lr_model.fit(X_train_scaled, y_train)

# Export sample of data
sample_indices = np.random.choice(len(X_test), min(100, len(X_test)), replace=False)
sample_data = {
    'X': X_test[sample_indices].tolist(),
    'y': y_test[sample_indices].tolist(),
    'feature_names': list(housing.feature_names)
}

model_data = export_model_to_json(lr_model, 'linear_regression', 'california_housing', scaler_lr, list(housing.feature_names))
model_data['sample_data'] = sample_data

with open('models/linear_regression_model.json', 'w') as f:
    json.dump(model_data, f, indent=2)

print(f"Linear Regression - R² Score: {lr_model.score(scaler_lr.transform(X_test), y_test):.4f}")

# 2. LOGISTIC REGRESSION - Breast Cancer
print("\nTraining Logistic Regression on Breast Cancer...")
cancer = load_breast_cancer()
X, y = cancer.data, cancer.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler_logr = StandardScaler()
X_train_scaled = scaler_logr.fit_transform(X_train)

logr_model = LogisticRegression(max_iter=1000, random_state=42)
logr_model.fit(X_train_scaled, y_train)

sample_indices = np.random.choice(len(X_test), min(100, len(X_test)), replace=False)
sample_data = {
    'X': X_test[sample_indices].tolist(),
    'y': y_test[sample_indices].tolist(),
    'feature_names': list(cancer.feature_names)
}

model_data = export_model_to_json(logr_model, 'logistic_regression', 'breast_cancer', scaler_logr, list(cancer.feature_names))
model_data['sample_data'] = sample_data

with open('models/logistic_regression_model.json', 'w') as f:
    json.dump(model_data, f, indent=2)

print(f"Logistic Regression - Accuracy: {logr_model.score(scaler_logr.transform(X_test), y_test):.4f}")

# 3. DECISION TREE - Iris Dataset
print("\nTraining Decision Tree on Iris...")
iris = load_iris()
X, y = iris.data, iris.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

dt_model = DecisionTreeClassifier(max_depth=4, random_state=42)
dt_model.fit(X_train, y_train)

sample_indices = np.random.choice(len(X_test), min(100, len(X_test)), replace=False)
sample_data = {
    'X': X_test[sample_indices].tolist(),
    'y': y_test[sample_indices].tolist(),
    'feature_names': list(iris.feature_names),
    'target_names': list(iris.target_names)
}

model_data = export_model_to_json(dt_model, 'decision_tree', 'iris', None, list(iris.feature_names))
model_data['sample_data'] = sample_data
model_data['target_names'] = list(iris.target_names)

with open('models/decision_tree_model.json', 'w') as f:
    json.dump(model_data, f, indent=2)

print(f"Decision Tree - Accuracy: {dt_model.score(X_test, y_test):.4f}")

# 4. RANDOM FOREST - Wine Dataset
print("\nTraining Random Forest on Wine...")
wine = load_wine()
X, y = wine.data, wine.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

rf_model = RandomForestClassifier(n_estimators=10, max_depth=5, random_state=42)
rf_model.fit(X_train, y_train)

sample_indices = np.random.choice(len(X_test), min(100, len(X_test)), replace=False)
sample_data = {
    'X': X_test[sample_indices].tolist(),
    'y': y_test[sample_indices].tolist(),
    'feature_names': list(wine.feature_names),
    'target_names': list(wine.target_names)
}

model_data = export_model_to_json(rf_model, 'random_forest', 'wine', None, list(wine.feature_names))
model_data['sample_data'] = sample_data
model_data['target_names'] = list(wine.target_names)

with open('models/random_forest_model.json', 'w') as f:
    json.dump(model_data, f, indent=2)

print(f"Random Forest - Accuracy: {rf_model.score(X_test, y_test):.4f}")

# 5. K-MEANS - Iris Dataset (for clustering)
print("\nTraining K-Means on Iris...")
iris = load_iris()
X = iris.data
scaler_kmeans = StandardScaler()
X_scaled = scaler_kmeans.fit_transform(X)

kmeans_model = KMeans(n_clusters=3, random_state=42, n_init=10)
kmeans_model.fit(X_scaled)

model_data = export_model_to_json(kmeans_model, 'kmeans', 'iris', scaler_kmeans, list(iris.feature_names))
model_data['sample_data'] = {
    'X': X.tolist(),
    'labels': kmeans_model.labels_.tolist(),
    'feature_names': list(iris.feature_names)
}

with open('models/kmeans_model.json', 'w') as f:
    json.dump(model_data, f, indent=2)

print(f"K-Means - Inertia: {kmeans_model.inertia_:.4f}")

# 6. KNN - Iris Dataset
print("\nTraining KNN on Iris...")
iris = load_iris()
X, y = iris.data, iris.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

knn_model = KNeighborsClassifier(n_neighbors=5)
knn_model.fit(X_train, y_train)

sample_indices = np.random.choice(len(X_test), min(100, len(X_test)), replace=False)
sample_data = {
    'X': X_test[sample_indices].tolist(),
    'y': y_test[sample_indices].tolist(),
    'feature_names': list(iris.feature_names),
    'target_names': list(iris.target_names)
}

model_data = export_model_to_json(knn_model, 'knn', 'iris', None, list(iris.feature_names))
model_data['sample_data'] = sample_data
model_data['target_names'] = list(iris.target_names)

with open('models/knn_model.json', 'w') as f:
    json.dump(model_data, f, indent=2)

print(f"KNN - Accuracy: {knn_model.score(X_test, y_test):.4f}")

# 7. SVM - Breast Cancer
print("\nTraining SVM on Breast Cancer...")
cancer = load_breast_cancer()
X, y = cancer.data, cancer.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler_svm = StandardScaler()
X_train_scaled = scaler_svm.fit_transform(X_train)

svm_model = SVC(kernel='rbf', random_state=42, probability=True)
svm_model.fit(X_train_scaled, y_train)

sample_indices = np.random.choice(len(X_test), min(100, len(X_test)), replace=False)
sample_data = {
    'X': X_test[sample_indices].tolist(),
    'y': y_test[sample_indices].tolist(),
    'feature_names': list(cancer.feature_names)
}

model_data = export_model_to_json(svm_model, 'svm', 'breast_cancer', scaler_svm, list(cancer.feature_names))
model_data['sample_data'] = sample_data

with open('models/svm_model.json', 'w') as f:
    json.dump(model_data, f, indent=2)

print(f"SVM - Accuracy: {svm_model.score(scaler_svm.transform(X_test), y_test):.4f}")

# 8. NEURAL NETWORK - Iris Dataset
print("\nTraining Neural Network on Iris...")
iris = load_iris()
X, y = iris.data, iris.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler_nn = StandardScaler()
X_train_scaled = scaler_nn.fit_transform(X_train)

nn_model = MLPClassifier(hidden_layer_sizes=(10, 5), max_iter=1000, random_state=42)
nn_model.fit(X_train_scaled, y_train)

sample_indices = np.random.choice(len(X_test), min(100, len(X_test)), replace=False)
sample_data = {
    'X': X_test[sample_indices].tolist(),
    'y': y_test[sample_indices].tolist(),
    'feature_names': list(iris.feature_names),
    'target_names': list(iris.target_names)
}

model_data = export_model_to_json(nn_model, 'neural_network', 'iris', scaler_nn, list(iris.feature_names))
model_data['sample_data'] = sample_data
model_data['target_names'] = list(iris.target_names)
model_data['hidden_layer_sizes'] = list(nn_model.hidden_layer_sizes)

with open('models/neural_network_model.json', 'w') as f:
    json.dump(model_data, f, indent=2)

print(f"Neural Network - Accuracy: {nn_model.score(scaler_nn.transform(X_test), y_test):.4f}")

print("\n[SUCCESS] All models trained and exported successfully!")

