# Training Real ML Models

This directory contains scripts to train real ML models on public datasets and export them for visualization.

## Setup

1. Install required Python packages:

```bash
pip install scikit-learn pandas numpy
```

## Training Models

Run the training script to download datasets, train models, and export them:

```bash
python train_models.py
```

This will:

- Download datasets from scikit-learn (Iris, Breast Cancer, Wine, California Housing)
- Train 8 different ML models
- Export models to JSON format in the `models/` directory
- Include sample data for visualization

## Models Trained

1. **Linear Regression** - California Housing Dataset
2. **Logistic Regression** - Breast Cancer Dataset
3. **Decision Tree** - Iris Dataset
4. **Random Forest** - Wine Dataset
5. **K-Means** - Iris Dataset
6. **KNN** - Iris Dataset
7. **SVM** - Breast Cancer Dataset
8. **Neural Network** - Iris Dataset

## Output

All models are exported as JSON files in `models/`:

- `linear_regression_model.json`
- `logistic_regression_model.json`
- `decision_tree_model.json`
- `random_forest_model.json`
- `kmeans_model.json`
- `knn_model.json`
- `svm_model.json`
- `neural_network_model.json`

Each JSON file contains:

- Model parameters/weights
- Feature scalers (if used)
- Sample test data for visualization
- Feature names and class labels

## Using in Visualizer

The JavaScript code in `real-models.js` automatically loads these models when available. If models aren't found, it falls back to simplified JavaScript implementations.

## Regenerating Models

To retrain models with different parameters or datasets, modify `train_models.py` and run it again.
