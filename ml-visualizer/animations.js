/**
 * Animation Functions for ML Visualizations
 */

// Use the same timing constants from console.js
// STEP_DELAY is defined in console.js, using getDelay() helper
function getDelay(baseDelay = 600) {
  return baseDelay / (window.PLAYBACK_SPEED || 1.0);
}

// Animate decision tree path traversal
function animateDecisionTreePath(point) {
  const prediction = decisionTreeModel.predict(point);
  const path = decisionTreeModel.getPath(point);

  // Clear previous highlights
  d3.selectAll(".decision-tree-node").classed("selected", false);
  d3.selectAll(".decision-tree-link").classed("active", false);
  d3.selectAll(".link")
    .attr("stroke", "rgba(255, 255, 255, 0.3)")
    .attr("stroke-width", 2);

  // Highlight the data point being processed
  d3.selectAll(".data-point").each(function () {
    const el = d3.select(this);
    const title = el.select("title");
    if (
      title &&
      title.text().includes(`Age: ${point.age}`) &&
      title.text().includes(`Income: ${point.income}`)
    ) {
      el.classed("selected", true)
        .transition()
        .duration(500)
        .attr("r", 10)
        .attr("stroke", "#fff")
        .attr("stroke-width", 3);
    }
  });

  // Animate through the path
  path.forEach((step, index) => {
    setTimeout(() => {
      if (step.node && !step.node.isLeaf()) {
        logToConsole(
          `[Step ${index + 1}] Evaluating: ${step.condition}`,
          "info"
        );

        // Find and highlight the node
        d3.selectAll(".decision-tree-node").each(function (d) {
          if (
            d.data &&
            (d.data.name.includes(step.condition) ||
              d.data.name === step.condition)
          ) {
            d3.select(this)
              .classed("selected", true)
              .transition()
              .duration(300)
              .attr("fill", "#4a90e2");
          }
        });

        // Highlight the link
        d3.selectAll(".link").each(function (d) {
          if (d.target && d.target.data) {
            const targetName = d.target.data.name || "";
            if (
              targetName.includes(step.condition) ||
              step.condition.includes(targetName)
            ) {
              d3.select(this)
                .transition()
                .duration(300)
                .attr("stroke", "#4ade80")
                .attr("stroke-width", 3);
            }
          }
        });
      }

      if (index === path.length - 1) {
        // Final result
        logToConsole(
          `✓ Reached leaf node. Prediction: ${prediction}`,
          "success"
        );

        // Reset node colors after delay
        setTimeout(() => {
          d3.selectAll(".decision-tree-node")
            .classed("selected", false)
            .transition()
            .duration(500)
            .attr("fill", "#1d2125");
          d3.selectAll(".data-point")
            .classed("selected", false)
            .transition()
            .duration(500)
            .attr("r", 6);
        }, 2000);
      }
    }, index * getDelay(1000));
  });
}

// Animate linear regression point plotting
function animateLinearRegressionPoint(point) {
  const ctx = document.getElementById("linear-regression-chart");
  if (!ctx || !linearRegressionChart) return;

  // Calculate prediction
  const prediction = linearRegressionModel.predict(point.x);

  logToConsole(
    `[Step 1] Clicked point: (${point.x.toFixed(2)}, ${point.y.toFixed(2)})`,
    "info"
  );
  setTimeout(() => {
    logToConsole(
      `[Step 2] Calculating prediction using regression line...`,
      "info"
    );
    setTimeout(() => {
      logToConsole(
        `[Step 3] Predicted Y value: ${prediction.toFixed(2)}`,
        "success"
      );
      logToConsole(
        `[Step 4] Error: ${Math.abs(prediction - point.y).toFixed(2)}`,
        "info"
      );

      // Add point with animation
      const newPoint = {
        x: point.x,
        y: point.y,
      };

      // Animate the point appearing
      const dataset = linearRegressionChart.data.datasets[1]; // Custom data dataset
      dataset.data.push(newPoint);

      // Update chart with animation
      linearRegressionChart.update("active");

      // Highlight the point on the chart
      setTimeout(() => {
        const chart = linearRegressionChart;
        const meta = chart.getDatasetMeta(1);
        const pointIndex = meta.data.length - 1;

        if (meta.data[pointIndex]) {
          // Animate highlight
          const metaPoint = meta.data[pointIndex];
          metaPoint._model.radius = 10;
          metaPoint._model.borderWidth = 3;
          linearRegressionChart.update("active");

          // Draw a line from point to prediction on regression line
          setTimeout(() => {
            // Visual feedback: show prediction line
            logToConsole(
              `✓ Prediction complete! See the regression line above.`,
              "success"
            );
          }, 500);
        }
      }, 500);
    }, 800);
  }, 500);
}

// Animate K-Means clustering
function animateKMeansClustering(k) {
  const ctx = document.getElementById("k-means-chart");
  if (!ctx) return;

  // Initialize centroids
  kMeansModel.initializeCentroids(datasets.kMeans);

  // Animate iterations
  let iteration = 0;
  const maxIterations = 5;

  function iterate() {
    if (iteration >= maxIterations) {
      renderKMeans(k);
      return;
    }

    kMeansModel.assignClusters(datasets.kMeans);
    kMeansModel.updateCentroids();

    // Render current state
    renderKMeans(k);

    iteration++;
    setTimeout(iterate, 1000);
  }

  iterate();
}

// Animate KNN classification
function animateKNNClassification(point, k) {
  const ctx = document.getElementById("knn-chart");
  if (!ctx || !knnChart) return;

  logToConsole(
    `[Step 1] Test point: (${point.x.toFixed(2)}, ${point.y.toFixed(2)})`,
    "info"
  );

  // Add test point
  customData.knn = [{ ...point, predictedClass: null }];

  // Calculate distances and animate
  const distances = datasets.knn.map((d) => ({
    point: d,
    distance: Math.sqrt(
      Math.pow(point.x - d.x, 2) + Math.pow(point.y - d.y, 2)
    ),
  }));

  distances.sort((a, b) => a.distance - b.distance);
  const kNearest = distances.slice(0, k);

  setTimeout(() => {
    logToConsole(
      `[Step 2] Calculated distances to all ${datasets.knn.length} training points`,
      "info"
    );
    setTimeout(() => {
      logToConsole(`[Step 3] Finding ${k} nearest neighbors...`, "info");

      // Highlight nearest neighbors with animation
      kNearest.forEach((neighbor, index) => {
        setTimeout(() => {
          logToConsole(
            `[Neighbor ${index + 1}] Distance: ${neighbor.distance.toFixed(
              3
            )}, Class: ${neighbor.point.class}`,
            "info"
          );

          // Find and highlight the point in the chart
          const dataset = knnChart.data.datasets.find((d) =>
            d.label.includes(neighbor.point.class)
          );
          if (dataset) {
            const pointIndex = dataset.data.findIndex(
              (p) =>
                Math.abs(p.x - neighbor.point.x) < 0.01 &&
                Math.abs(p.y - neighbor.point.y) < 0.01
            );
            if (pointIndex !== -1) {
              // Animate highlight
              const meta = knnChart.getDatasetMeta(
                knnChart.data.datasets.indexOf(dataset)
              );
              if (meta.data[pointIndex]) {
                meta.data[pointIndex]._model.radius = 10;
                meta.data[pointIndex]._model.borderWidth = 3;
                knnChart.update("active");
              }
            }
          }

          if (index === kNearest.length - 1) {
            setTimeout(() => {
              // Final classification
              const prediction = knnModel.predict(point, k);
              customData.knn[0].predictedClass = prediction;

              const classCounts = {};
              kNearest.forEach((n) => {
                classCounts[n.point.class] =
                  (classCounts[n.point.class] || 0) + 1;
              });

              logToConsole(
                `[Step 4] Votes: ${Object.entries(classCounts)
                  .map(([c, v]) => `${c}=${v}`)
                  .join(", ")}`,
                "info"
              );
              logToConsole(
                `✓ Prediction: Class ${prediction} (majority vote)`,
                "success"
              );

              renderKNN();
            }, 500);
          }
        }, index * 500);
      });
    }, 500);
  }, 500);
}

// Animate neural network forward pass
function animateNeuralNetworkForward(inputs) {
  const result = neuralNetwork.forward(inputs);

  // Animate input layer
  result.inputs.forEach((val, i) => {
    setTimeout(() => {
      const neuron = d3.select(`#neuron-0-${i}`);
      neuron.classed("active", true);
      neuron
        .transition()
        .duration(500)
        .attr("fill", val > 0.5 ? "#4a90e2" : "#1d2125");
    }, i * 200);
  });

  // Animate hidden layer
  const inputDelay = result.inputs.length * 200;
  result.hidden.forEach((val, i) => {
    setTimeout(() => {
      const neuron = d3.select(`#neuron-1-${i}`);
      neuron.classed("active", true);
      neuron
        .transition()
        .duration(500)
        .attr("fill", val > 0.5 ? "#4a90e2" : "#1d2125");

      // Animate connections
      d3.select(`#conn-0-${i}`).classed("active", true);
      d3.select(`#conn-1-${i}`).classed("active", true);
      d3.select(`#conn-h${i}-out`).classed("active", val > 0.5);
    }, inputDelay + i * 200);
  });

  // Animate output layer
  const hiddenDelay = inputDelay + result.hidden.length * 200;
  setTimeout(() => {
    const outputNeuron = d3.select("#neuron-2-0");
    outputNeuron.classed("active", true);
    outputNeuron
      .transition()
      .duration(500)
      .attr("fill", result.output > 0.5 ? "#4a90e2" : "#1d2125");
  }, hiddenDelay + 200);
}

// Animate SVM decision boundary
function animateSVMBoundary() {
  if (!svmChart) return;

  // Animate boundary line drawing
  const boundaryDataset = svmChart.data.datasets.find(
    (d) => d.label === "Decision Boundary"
  );
  if (boundaryDataset) {
    boundaryDataset.data.forEach((point, index) => {
      setTimeout(() => {
        svmChart.update("none");
      }, index * 10);
    });
  }
}
