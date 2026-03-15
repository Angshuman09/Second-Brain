## ==Core Concept==

The main goal of training a **Perceptron** is to find the best values for **weights** ($w_1, w_2, ...$) and a **bias** ($b$).  
These values together create a **decision boundary** that separates data into different groups.

For example:

- In **2D**, the boundary is a **line**.
    
- In **3D**, it becomes a **plane**.
    
- In higher dimensions, it is called a **hyperplane**.
    

This boundary helps the model decide which class a data point belongs to.

**Important Limitation:**  
A Perceptron only works properly when the data can be separated using a **straight line** (or a flat surface).

If the data points are mixed in such a way that **no single straight line can perfectly separate them**, the basic Perceptron will **never find a perfect solution**.

![[linear-nonLinear.png]]

Note: [[Linear and Non-Linear Classification]]
## ==Mathematical Foundation: Identifying Half-Spaces==
Before the algorithm can adjust its parameters, it must establish a mathematical sense of space to determine if a prediction is currently correct or incorrect.

Given the standard linear equation representing our decision boundary: 
$$Ax + By + C = 0$$

This line divides the entire feature space into two distinct regions, or half-spaces:
* **The Positive Region:** Any data point with coordinates $(x, y)$ that, when plugged into the equation, results in a value greater than zero ($Ax + By + C > 0$).
* **The Negative Region:** Any data point that results in a value less than zero ($Ax + By + C < 0$).

![[scatterPlot.png]]

## ==Geometric Transformations==
Training is the act of moving this decision boundary line through space until it sits exactly between the two classes. The algorithm accomplishes this by altering the coefficients ($A$, $B$, and $C$). 

Understanding how changing these numbers affects the geometry of the line is crucial:
1.  **Translating the Line:** Modifying the constant/bias term ($C$) shifts the line parallel to its original position. Increasing $C$ moves the line in one direction, while decreasing it moves it in the opposite direction.
2.  **Rotating the Line:** Modifying the variable coefficients or weights ($A$ or $B$) changes the slope, effectively rotating the line around the origin or intersecting axes.

![[line shift.png]]
## ==The Perceptron Trick: Intuition==
The Perceptron Trick avoids complex calculus (like gradient descent) in favor of a geometric heuristic. The logic relies on misclassified points acting as physical forces that "pull" or "push" the decision boundary.

The process begins by plotting a random line. Then, we evaluate a single random data point against this line. If the point is classified correctly, we do nothing. If it is misclassified, we apply a transformation based on the type of error:

### Case 1: Resolving False Negatives
* **The Scenario:** A point that belongs to the positive class (target label is 1) is currently sitting in the negative region.
* **The Geometric Fix:** The line needs to move toward the positive point to engulf it into the correct positive region.
* **The Mathematical Action:** We add the coordinates of the misclassified point to the current weights and bias of the line.

### Case 2: Resolving False Positives
* **The Scenario:** A point that belongs to the negative class (target label is 0) is incorrectly sitting in the positive region.
* **The Geometric Fix:** The line needs to move away from the negative point, leaving it behind in the negative region.
* **The Mathematical Action:** We subtract the coordinates of the misclassified point from the current weights and bias of the line.

> [Insert Image Here: A two-part visual sequence. Part 1 shows a misclassified positive point sitting in the negative region with an arrow pointing from the line to the point. Part 2 shows the updated decision boundary, which has now shifted to correctly encompass that point in the positive region.]

## The Necessity of the Learning Rate
If we directly add or subtract the raw coordinate values of a misclassified point, the decision boundary will undergo a massive, erratic jump. This drastic transformation will likely destroy the correct classifications of previously evaluated points.

To solve this, we introduce the Learning Rate ($\eta$). This is a very small scalar value (commonly between 0.01 and 0.1). By multiplying the point's coordinates by the learning rate before adding or subtracting them, we force the line to take tiny, incremental steps toward the optimal boundary.

## The Unified Update Rule
Instead of writing an algorithm packed with conditional statements checking for false positives and false negatives, the Perceptron logic can be elegantly compressed into a single mathematical update rule:

$$W_{new} = W_{old} + \eta \cdot (y_i - \hat{y}_i) \cdot X_i$$

**Deconstructing the Variables:**
* **$W$**: The weight vector. To simplify calculations, the bias term is typically absorbed into this vector as $W_0$.
* **$\eta$**: The scalar Learning Rate.
* **$y_i$**: The actual ground-truth label of the selected point (either 1 or 0).
* **$\hat{y}_i$**: The model's predicted label (either 1 or 0, determined by the Step Function).
* **$X_i$**: The input feature vector of the selected point. To align with the absorbed bias, a dummy feature $X_0 = 1$ is prepended to this vector.

**Why this formula acts as an automatic switch:**
The term $(y_i - \hat{y}_i)$ evaluates the error and determines the mathematical operation automatically:
* **Correct Prediction ($y_i = \hat{y}_i$):** The term evaluates to $0$. The entire update modifier becomes zero, and the weights remain unchanged.
* **False Negative ($y_i = 1, \hat{y}_i = 0$):** The term evaluates to $1$. The formula equates to $W_{old} + (\eta \cdot X_i)$, effectively adding the coordinates and pulling the line closer.
* **False Positive ($y_i = 0, \hat{y}_i = 1$):** The term evaluates to $-1$. The formula equates to $W_{old} - (\eta \cdot X_i)$, effectively subtracting the coordinates and pushing the line away.

> [Insert Image Here: A mathematical breakdown of the unified update rule. Highlight the $(y_i - \hat{y}_i)$ segment and visually branch it out into the three possible outcomes: 0, 1, and -1, explaining how it acts as a dynamic sign switch.]

## The Training Algorithm Architecture
To implement this mathematically, the training loop follows these precise steps:

1.  **Initialization:** Assign random, small numerical values to the weight vector and bias.
2.  **Epoch Iteration:** Begin a loop that runs for a predetermined number of iterations, known as epochs (e.g., 1000 times).
3.  **Stochastic Selection:** Within each epoch, randomly select exactly one data point ($X_i$) from the training dataset.
4.  **Forward Pass (Prediction):** Calculate the dot product of the selected point's features and the current weights ($X_i \cdot W$). Pass this scalar result through the Step Function to generate the prediction ($\hat{y}_i$).
5.  **Weight Update:** Apply the unified update rule formula to generate the new weight vector.
6.  **Loop Continuation:** Repeat steps 3 through 5. Over thousands of iterations, the tiny adjustments dictated by the learning rate will cause the decision boundary to converge on the optimal separation line.