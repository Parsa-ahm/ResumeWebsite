# ============================================================================
# TRAINING CODE FOR ML VISUALIZER - REAL MODELS FROM PUBLIC DATASETS
# ============================================================================

# ============================================================================
# 1. LINEAR REGRESSION - California Housing Dataset
# ============================================================================
def train_linear_regression():
    """Train Linear Regression on California Housing Dataset"""
    from sklearn.datasets import fetch_california_housing
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import StandardScaler
    from sklearn.linear_model import LinearRegression
    
    # Load dataset
    housing = fetch_california_housing()
    X, y = housing.data, housing.target
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    model = LinearRegression()
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    score = model.score(X_test_scaled, y_test)
    print(f"R² Score: {score:.4f}")
    
    return model, scaler, housing.feature_names

# ============================================================================
# 2. LOGISTIC REGRESSION - Breast Cancer Dataset
# ============================================================================
def train_logistic_regression():
    """Train Logistic Regression on Breast Cancer Dataset"""
    from sklearn.datasets import load_breast_cancer
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import StandardScaler
    from sklearn.linear_model import LogisticRegression
    
    # Load dataset
    cancer = load_breast_cancer()
    X, y = cancer.data, cancer.target
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    model = LogisticRegression(max_iter=1000, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    accuracy = model.score(X_test_scaled, y_test)
    print(f"Accuracy: {accuracy:.4f}")
    
    return model, scaler, cancer.feature_names

# ============================================================================
# 3. DECISION TREE - Iris Dataset
# ============================================================================
def train_decision_tree():
    """Train Decision Tree on Iris Dataset"""
    from sklearn.datasets import load_iris
    from sklearn.model_selection import train_test_split
    from sklearn.tree import DecisionTreeClassifier
    
    # Load dataset
    iris = load_iris()
    X, y = iris.data, iris.target
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Train model
    model = DecisionTreeClassifier(max_depth=4, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate
    accuracy = model.score(X_test, y_test)
    print(f"Accuracy: {accuracy:.4f}")
    
    return model, None, iris.feature_names, iris.target_names

# ============================================================================
# 4. RANDOM FOREST - Wine Dataset
# ============================================================================
def train_random_forest():
    """Train Random Forest on Wine Dataset"""
    from sklearn.datasets import load_wine
    from sklearn.model_selection import train_test_split
    from sklearn.ensemble import RandomForestClassifier
    
    # Load dataset
    wine = load_wine()
    X, y = wine.data, wine.target
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Train model
    model = RandomForestClassifier(
        n_estimators=10, max_depth=5, random_state=42
    )
    model.fit(X_train, y_train)
    
    # Evaluate
    accuracy = model.score(X_test, y_test)
    print(f"Accuracy: {accuracy:.4f}")
    
    return model, None, wine.feature_names, wine.target_names

# ============================================================================
# 5. K-MEANS CLUSTERING - Iris Dataset
# ============================================================================
def train_kmeans():
    """Train K-Means on Iris Dataset"""
    from sklearn.datasets import load_iris
    from sklearn.preprocessing import StandardScaler
    from sklearn.cluster import KMeans
    
    # Load dataset
    iris = load_iris()
    X = iris.data
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Train model
    model = KMeans(n_clusters=3, random_state=42, n_init=10)
    model.fit(X_scaled)
    
    # Evaluate
    inertia = model.inertia_
    print(f"Inertia: {inertia:.4f}")
    
    return model, scaler, iris.feature_names

# ============================================================================
# 6. K-NEAREST NEIGHBORS - Iris Dataset
# ============================================================================
def train_knn():
    """Train KNN on Iris Dataset"""
    from sklearn.datasets import load_iris
    from sklearn.model_selection import train_test_split
    from sklearn.neighbors import KNeighborsClassifier
    
    # Load dataset
    iris = load_iris()
    X, y = iris.data, iris.target
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Train model
    model = KNeighborsClassifier(n_neighbors=5)
    model.fit(X_train, y_train)
    
    # Evaluate
    accuracy = model.score(X_test, y_test)
    print(f"Accuracy: {accuracy:.4f}")
    
    return model, None, iris.feature_names, iris.target_names

# ============================================================================
# 7. SUPPORT VECTOR MACHINE - Breast Cancer Dataset
# ============================================================================
def train_svm():
    """Train SVM on Breast Cancer Dataset"""
    from sklearn.datasets import load_breast_cancer
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import StandardScaler
    from sklearn.svm import SVC
    
    # Load dataset
    cancer = load_breast_cancer()
    X, y = cancer.data, cancer.target
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    model = SVC(kernel='rbf', random_state=42, probability=True)
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    accuracy = model.score(X_test_scaled, y_test)
    print(f"Accuracy: {accuracy:.4f}")
    
    return model, scaler, cancer.feature_names

# ============================================================================
# 8. NEURAL NETWORK - Iris Dataset
# ============================================================================
def train_neural_network():
    """Train Neural Network on Iris Dataset"""
    from sklearn.datasets import load_iris
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import StandardScaler
    from sklearn.neural_network import MLPClassifier
    
    # Load dataset
    iris = load_iris()
    X, y = iris.data, iris.target
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    model = MLPClassifier(
        hidden_layer_sizes=(10, 5), 
        max_iter=1000, 
        random_state=42
    )
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    accuracy = model.score(X_test_scaled, y_test)
    print(f"Accuracy: {accuracy:.4f}")
    
    return model, scaler, iris.feature_names, iris.target_names

